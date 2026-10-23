
"use server";

import { createClient } from "@/utils/supabase/server";
import { scrapeProduct } from "@/lib/firecrawl";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addProduct(formData) {
  const url = formData.get("url");

  if (!url) {
    return { error: "URL is required" };
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Please sign in to add a product." };
    }

    const productData = await scrapeProduct(url);

    if (!productData?.productName || !productData?.currentPrice) {
      return {
        error: "Could not extract product information from this URL.",
      };
    }

    const newPrice = Number.parseFloat(productData.currentPrice);

    if (!Number.isFinite(newPrice) || newPrice <= 0) {
      return { error: "The product price returned is invalid." };
    }

    const currency = productData.currencyCode || "USD";

    const { data: existingProduct, error: lookupError } = await supabase
      .from("Products")
      .select("id, current_price")
      .eq("user_id", user.id)
      .eq("url", url)
      .maybeSingle();

    if (lookupError) throw lookupError;

    const isUpdate = Boolean(existingProduct);

    // Use the exact Products table name from Supabase.
    const { data: product, error: productError } = await supabase
      .from("Products")
      .upsert(
        {
          user_id: user.id,
          url,
          Name: productData.productName,
          current_price: newPrice,
          currency,
          image_url: productData.productImageUrl || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,url",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (productError) throw productError;

    const shouldAddHistory =
      !isUpdate ||
      Number(existingProduct.current_price) !== newPrice;

    if (shouldAddHistory) {
      const { error: historyError } = await supabase
        .from("price_history")
        .insert({
          product_id: product.id,
          price: newPrice,
          currency,
        });

      if (historyError) {
        console.error("Price history insert error:", historyError);
      }
    }

    revalidatePath("/");

    return {
      success: true,
      product,
      message: isUpdate
        ? "Product updated with latest price!"
        : "Product added successfully!",
    };
  } catch (error) {
    console.error("Add product error:", {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
    });

    return {
      error: error?.message || "Failed to add product.",
    };
  }
}

export async function deleteProduct(productId) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("Products")
      .delete()
      .eq("id", productId);

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete product error:", error);
    return { error: error?.message || "Failed to delete product." };
  }
}

export async function getProducts() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("Products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Get products error:", {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
    });

    return [];
  }
}

export async function getPriceHistory(productId) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("price_history")
      .select("*")
      .eq("product_id", productId)
      .order("checked_at", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Get price history error:", error);
    return [];
  }
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/");
  redirect("/");
}
