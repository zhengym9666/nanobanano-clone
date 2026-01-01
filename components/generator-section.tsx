"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Wand2, Loader2, Download } from "lucide-react"


export function GeneratorSection() {
  const [prompt, setPrompt] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        // Convert image to base64
        const base64 = reader.result as string;
        
        // Check if image is too large (> 5MB)
        const sizeInMB = file.size / (1024 * 1024);
        if (sizeInMB > 5) {
          alert("Image too large. Please select an image smaller than 5MB.");
          return;
        }
        
        // Set the image
        setSelectedImage(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateImage = async () => {
    if (!prompt.trim() || !selectedImage) {
      alert("Please provide both a prompt and an image")
      return
    }

    setIsGenerating(true)
    try {
      // Create an AbortController for the client-side timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 320000) // 5 minutes 20 seconds (20s buffer)

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          prompt: prompt,
        }),
        signal: controller.signal
      })

      // Clear the timeout since the request completed
      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 408) {
          throw new Error(data.error || 'Request timed out. Please try again.')
        }
        throw new Error(data.error || 'Failed to generate image')
      }

      if (data.imageUrl) {
        console.log("Generated image URL:", data.imageUrl)
        setGeneratedImages(prev => [...prev, data.imageUrl])
      } else {
        console.log("No image found in response")
        console.log("Full response:", data)
        alert("图像已生成，但未找到图片URL。请查看控制台了解详情。")
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error("Request timed out after 5 minutes 20 seconds")
        alert("请求超时。图像生成时间过长，请重试。")
      } else {
        console.error("Error generating image:", error)
        alert("Failed to generate image. Please try again.")
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `generated-image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading image:", error)
    }
  }

  return (
    <section id="generator" className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Get Started</h2>
            <p className="text-lg text-muted-foreground">Try The AI Editor</p>
            <p className="text-muted-foreground">
              Experience the power of nano-banana's natural language image editing. Transform any photo with simple text
              commands
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Prompt Engine
                </CardTitle>
                <CardDescription>Transform your image with AI-powered editing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Reference Image</Label>
                  <div className="flex flex-col items-center justify-center gap-4">
                    {selectedImage ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-border">
                        <img
                          src={selectedImage || "/placeholder.svg"}
                          alt="Uploaded"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/50 p-12 transition-colors hover:bg-muted">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Click to upload image</span>
                        <span className="text-xs text-muted-foreground">Max 5MB</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    )}
                    {selectedImage && (
                      <Button variant="outline" size="sm" onClick={() => setSelectedImage(null)}>
                        Remove Image
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Main Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe your desired edits... e.g., 'place the creature in a snowy mountain' or 'change the background to a sunset beach'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-32 resize-none"
                  />
                </div>

                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                  size="lg"
                  onClick={generateImage}
                  disabled={isGenerating || !prompt.trim() || !selectedImage}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Now"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle>Output Gallery</CardTitle>
                <CardDescription>Your ultra-fast AI creations appear here instantly</CardDescription>
              </CardHeader>
              <CardContent>
                {generatedImages.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {generatedImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Generated image ${index + 1}`}
                          className="w-full rounded-lg border"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => downloadImage(imageUrl)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-border bg-muted/50 p-8">
                    <Wand2 className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                      <p className="font-medium text-foreground">Ready for instant generation</p>
                      <p className="text-sm text-muted-foreground">Enter your prompt and unleash the power</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}