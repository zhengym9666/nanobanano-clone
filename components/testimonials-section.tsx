import { Card, CardContent } from "@/components/ui/card"

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
          <p className="text-lg text-muted-foreground">Simple steps to transform your images</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="mb-4 text-4xl">1</div>
              <h3 className="font-semibold text-lg mb-2">Upload Your Image</h3>
              <p className="text-muted-foreground">
                Simply drag and drop or select any image you want to edit. Our editor supports all common image formats.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="mb-4 text-4xl">2</div>
              <h3 className="font-semibold text-lg mb-2">Describe Your Vision</h3>
              <p className="text-muted-foreground">
                Use natural language to describe what you want to change. Our AI understands complex instructions and context.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="mb-4 text-4xl">3</div>
              <h3 className="font-semibold text-lg mb-2">Get Amazing Results</h3>
              <p className="text-muted-foreground">
                Watch as our AI transforms your image exactly as you imagined. Download your edited image instantly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
