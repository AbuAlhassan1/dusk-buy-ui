import { Star, Award, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">About LUXE</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We curate the finest collection of premium products for those who appreciate quality and elegance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Star,
              title: 'Premium Selection',
              description: 'Every product is carefully handpicked for quality and style',
            },
            {
              icon: Award,
              title: 'Excellence',
              description: 'Committed to providing the best luxury shopping experience',
            },
            {
              icon: Users,
              title: 'Customer First',
              description: 'Your satisfaction is our top priority',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg glass-effect hover-lift"
            >
              <item.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-invert max-w-none">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Founded with a passion for luxury and excellence, LUXE brings together the world's
            finest products in one curated collection. We believe that quality should never be
            compromised, and style should always be timeless.
          </p>
          <p className="text-lg text-muted-foreground mb-6">
            Our team travels the globe to discover unique pieces that embody craftsmanship,
            innovation, and elegance. Each item in our collection tells a story and represents
            our commitment to bringing you only the best.
          </p>
          <p className="text-lg text-muted-foreground">
            Join us on this journey of discovery and elevate your lifestyle with products
            that are designed to last and inspire.
          </p>
        </div>
      </div>
    </div>
  );
}
