export default function TestTheme() {
  return (
    <div className="p-8 space-y-4">
      <div className="bg-background text-foreground p-4 border border-border">
        Background / Foreground
      </div>
      <div className="bg-muted text-muted-foreground p-4">
        Muted Background
      </div>
      <div className="bg-card text-card-foreground p-4 border border-border">
        Card
      </div>
      <div className="bg-accent text-accent-foreground p-4">
        Accent
      </div>
      <div className="bg-code-bg text-code-text p-4 border border-code-border font-mono">
        Code Block Colors
      </div>

      <div className="prose">
        <h1>Typography Test</h1>
        <p>This is a paragraph with <a href="#">a link</a> inside.</p>
        <pre><code>const test = &quot;code block&quot;;</code></pre>
        <blockquote>This is a quote</blockquote>
      </div>
    </div>
  )
}
