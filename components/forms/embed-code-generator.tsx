'use client'

import { useState } from 'react'
import { Copy, Check, Code, FileCode, Globe } from 'lucide-react'

interface EmbedCodeGeneratorProps {
  formId: string
  formTitle: string
}

export default function EmbedCodeGenerator({ formId, formTitle }: EmbedCodeGeneratorProps) {
  const [embedType, setEmbedType] = useState<'iframe' | 'javascript' | 'wordpress'>('iframe')
  const [copied, setCopied] = useState(false)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const formUrl = `${baseUrl}/f/${formId}`

  const embedCodes = {
    iframe: `<!-- Stoneforms Embed - ${formTitle} -->
<iframe 
  src="${formUrl}" 
  width="100%" 
  height="600" 
  frameborder="0" 
  style="border: none; border-radius: 8px;"
  title="${formTitle}"
></iframe>`,

    javascript: `<!-- Stoneforms JavaScript Embed - ${formTitle} -->
<div id="stoneforms-${formId}"></div>
<script>
  (function() {
    const container = document.getElementById('stoneforms-${formId}');
    const iframe = document.createElement('iframe');
    iframe.src = '${formUrl}';
    iframe.width = '100%';
    iframe.height = '600';
    iframe.frameBorder = '0';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    iframe.title = '${formTitle}';
    container.appendChild(iframe);
    
    // Auto-resize iframe based on content
    window.addEventListener('message', function(e) {
      if (e.origin === '${baseUrl}' && e.data.formId === '${formId}') {
        iframe.height = e.data.height + 'px';
      }
    });
  })();
</script>`,

    wordpress: `<?php
/**
 * Stoneforms Embed Shortcode
 * Usage: [stoneforms id="${formId}"]
 */
function stoneforms_embed_shortcode($atts) {
    $atts = shortcode_atts(array(
        'id' => '${formId}',
        'width' => '100%',
        'height' => '600',
    ), $atts);
    
    $form_url = '${formUrl}';
    
    return sprintf(
        '<div class="stoneforms-embed">
            <iframe 
                src="%s" 
                width="%s" 
                height="%s" 
                frameborder="0" 
                style="border: none; border-radius: 8px;"
                title="${formTitle}"
            ></iframe>
        </div>',
        esc_url($form_url),
        esc_attr($atts['width']),
        esc_attr($atts['height'])
    );
}
add_shortcode('stoneforms', 'stoneforms_embed_shortcode');

// Add this to your theme's functions.php file
// Then use shortcode: [stoneforms id="${formId}"]
?>`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Embed Type Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setEmbedType('iframe')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all ${
            embedType === 'iframe' 
              ? 'border-stone-900 bg-stone-50' 
              : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <Code className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">HTML/iframe</div>
            <div className="text-xs text-stone-600">Simple embed</div>
          </div>
        </button>

        <button
          onClick={() => setEmbedType('javascript')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all ${
            embedType === 'javascript' 
              ? 'border-stone-900 bg-stone-50' 
              : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <FileCode className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">JavaScript</div>
            <div className="text-xs text-stone-600">Auto-resize</div>
          </div>
        </button>

        <button
          onClick={() => setEmbedType('wordpress')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all ${
            embedType === 'wordpress' 
              ? 'border-stone-900 bg-stone-50' 
              : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <Globe className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">WordPress</div>
            <div className="text-xs text-stone-600">Shortcode</div>
          </div>
        </button>
      </div>

      {/* Code Display */}
      <div className="relative">
        <pre className="bg-stone-900 text-stone-100 p-6 rounded-lg overflow-x-auto text-sm">
          <code>{embedCodes[embedType]}</code>
        </pre>
        <button
          onClick={() => copyToClipboard(embedCodes[embedType])}
          className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Code
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">📝 How to use:</h4>
        <div className="text-sm text-blue-800 space-y-1">
          {embedType === 'iframe' && (
            <>
              <p>1. Copy the code above</p>
              <p>2. Paste it into your website's HTML</p>
              <p>3. The form will appear embedded on your page</p>
            </>
          )}
          {embedType === 'javascript' && (
            <>
              <p>1. Copy the code above</p>
              <p>2. Paste it into your website's HTML where you want the form</p>
              <p>3. The form will automatically resize based on content</p>
            </>
          )}
          {embedType === 'wordpress' && (
            <>
              <p>1. Copy the PHP code above</p>
              <p>2. Add it to your theme's functions.php file</p>
              <p>3. Use the shortcode [stoneforms id="{formId}"] in any page or post</p>
              <p>4. The form will appear wherever you place the shortcode</p>
            </>
          )}
        </div>
      </div>

      {/* Direct Link */}
      <div className="border-t border-stone-200 pt-4">
        <label className="block text-sm font-medium text-stone-900 mb-2">
          Direct Link (for emails, social media, etc.):
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formUrl}
            readOnly
            className="flex-1 px-4 py-2 border border-stone-300 rounded-lg bg-stone-50 text-sm"
          />
          <button
            onClick={() => copyToClipboard(formUrl)}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Advanced Options */}
      <details className="border border-stone-200 rounded-lg">
        <summary className="px-4 py-3 cursor-pointer font-medium text-stone-900 hover:bg-stone-50">
          Advanced Options
        </summary>
        <div className="p-4 border-t border-stone-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-900 mb-2">
              Custom Width
            </label>
            <input
              type="text"
              placeholder="100%"
              className="w-full px-4 py-2 border border-stone-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-900 mb-2">
              Custom Height
            </label>
            <input
              type="text"
              placeholder="600"
              className="w-full px-4 py-2 border border-stone-300 rounded-lg"
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-stone-900">Hide branding</span>
              <span className="text-xs text-stone-600">(Pro plan)</span>
            </label>
          </div>
        </div>
      </details>
    </div>
  )
}
