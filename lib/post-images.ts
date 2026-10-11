import { supabase } from "@/lib/supabase"

const MAX_IMAGE_SIZE = 8 * 1024 * 1024
const MAX_IMAGE_EDGE = 1600

export function compressPostImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) return Promise.reject(new Error("اختر ملف صورة صالحًا"))
  if (file.size > MAX_IMAGE_SIZE) return Promise.reject(new Error("حجم الصورة يجب ألا يتجاوز 8 ميجابايت"))

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("تعذر قراءة الصورة"))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error("تعذر فتح الصورة"))
      image.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(image.width, image.height))
        const canvas = document.createElement("canvas")
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        const context = canvas.getContext("2d")
        if (!context) return reject(new Error("تعذر تجهيز الصورة"))
        context.fillStyle = "#ffffff"
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", 0.82))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export async function persistPostImage(imageData: string, ownerId: string, useSupabase: boolean) {
  if (!imageData || !useSupabase) return imageData

  const blob = await (await fetch(imageData)).blob()
  const path = `${ownerId}/${Date.now()}-${crypto.randomUUID()}.jpg`
  const { error } = await supabase.storage.from("post-images").upload(path, blob, {
    cacheControl: "3600",
    contentType: "image/jpeg",
    upsert: false,
  })
  if (error) throw error

  return supabase.storage.from("post-images").getPublicUrl(path).data.publicUrl
}