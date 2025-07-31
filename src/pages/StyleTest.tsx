import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function StyleTest() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-primary mb-8">Style Test Page</h1>
      
      {/* Test basic Tailwind classes */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Basic Tailwind Classes</h2>
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-blue-500 rounded"></div>
          <div className="w-24 h-24 bg-red-500 rounded"></div>
          <div className="w-24 h-24 bg-green-500 rounded"></div>
        </div>
      </div>

      {/* Test custom gradients */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Custom Gradients</h2>
        <div className="flex gap-4">
          <div className="w-32 h-32 bg-gradient-ocean rounded-lg"></div>
          <div className="w-32 h-32 bg-gradient-sunrise rounded-lg"></div>
          <div className="w-32 h-32 bg-gradient-tropical rounded-lg"></div>
        </div>
      </div>

      {/* Test shadcn/ui Card */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">shadcn/ui Card Component</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>This is a test card to verify styling</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here. The card should have proper borders, shadows, and spacing.</p>
          </CardContent>
        </Card>
      </div>

      {/* Test shadcn/ui Buttons */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">shadcn/ui Button Components</h2>
        <div className="flex gap-4 flex-wrap">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="mobile" size="mobile">Mobile Button</Button>
        </div>
      </div>

      {/* Test CSS variables */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">CSS Variables</h2>
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-primary rounded"></div>
          <div className="w-24 h-24 bg-secondary rounded"></div>
          <div className="w-24 h-24 bg-accent rounded"></div>
        </div>
      </div>

      {/* Test shadows */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Custom Shadows</h2>
        <div className="flex gap-4">
          <div className="w-32 h-32 bg-white rounded-lg shadow-ocean"></div>
          <div className="w-32 h-32 bg-white rounded-lg shadow-sunrise"></div>
          <div className="w-32 h-32 bg-white rounded-lg shadow-elegant"></div>
        </div>
      </div>
    </div>
  );
}