/**
 * HTML Sanitization Utility
 *
 * Provides safe HTML rendering for training content.
 * All dynamic HTML content MUST be sanitized through this utility.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 *
 * IMPORTANT: This function MUST be used before any dangerouslySetInnerHTML
 * It removes all malicious scripts, event handlers, and unsafe attributes
 *
 * @param html - Raw HTML string (typically from markdown conversion)
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    // Allow comprehensive tags for rich training content
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'hr',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
      'section'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id',
      'style', 'colspan', 'rowspan', 'width', 'height'
    ],
    // Remove all <script> tags and event handlers
    FORBID_TAGS: ['script', 'object', 'embed', 'iframe'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover']
  });
}

/**
 * Sanitize and create object for dangerouslySetInnerHTML
 *
 * Convenience function that directly returns the object needed for React
 *
 * @param html - Raw HTML string
 * @returns Object with __html property for dangerouslySetInnerHTML
 */
export function createSanitizedMarkup(html: string): { __html: string } {
  return {
    __html: sanitizeHTML(html)
  };
}
