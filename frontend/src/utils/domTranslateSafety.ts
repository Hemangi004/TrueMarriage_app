/**
 * Google Translate / Browser Translation DOM Safety Patch for React
 */

export function setupDomTranslateSafety(): void {
  if (typeof window === 'undefined' || typeof Node === 'undefined' || !Node.prototype) {
    return;
  }

  const proto = Node.prototype as any;
  if (proto.__google_translate_safety_installed__) {
    return;
  }
  proto.__google_translate_safety_installed__ = true;

  // 1. Patch removeChild
  const originalRemoveChild = proto.removeChild;
  proto.removeChild = function <T extends Node>(child: T): T {
    if (!child) return child;
    try {
      if (child.parentNode !== this) {
        if (child.parentNode) {
          return originalRemoveChild.call(child.parentNode, child) as T;
        }
        return child;
      }
      return originalRemoveChild.call(this, child) as T;
    } catch {
      return child;
    }
  };

  // 2. Patch insertBefore
  const originalInsertBefore = proto.insertBefore;
  proto.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (!newNode) return newNode;
    try {
      if (referenceNode && referenceNode.parentNode !== this) {
        if (referenceNode.parentNode && referenceNode.parentNode.parentNode === this) {
          try {
            return originalInsertBefore.call(this, newNode, referenceNode.parentNode) as T;
          } catch {}
        }
        try {
          return proto.appendChild.call(this, newNode) as T;
        } catch {
          return newNode;
        }
      }
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    } catch {
      try {
        return proto.appendChild.call(this, newNode) as T;
      } catch {
        return newNode;
      }
    }
  };

  // 3. Patch replaceChild
  const originalReplaceChild = proto.replaceChild;
  proto.replaceChild = function <T extends Node>(newChild: Node, oldChild: T): T {
    if (!oldChild || !newChild) return oldChild;
    try {
      if (oldChild.parentNode !== this) {
        if (oldChild.parentNode) {
          return originalReplaceChild.call(oldChild.parentNode, newChild, oldChild) as T;
        }
        return oldChild;
      }
      return originalReplaceChild.call(this, newChild, oldChild) as T;
    } catch {
      return oldChild;
    }
  };

  // 4. Suppress Google Translate's default raw spinner widget and banner frames
  const suppressTranslateSpinner = () => {
    const selector = [
      '.goog-te-spinner-pos',
      '.goog-te-spinner',
      '.goog-te-spinner-animation',
      '.goog-te-gadget-icon',
      '[class*="VIpgJd-ZVi9od"]',
      '[class*="goog-te-spinner"]',
    ].join(',');

    const removeMatches = () => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          (el as HTMLElement).style.setProperty('display', 'none', 'important');
          (el as HTMLElement).style.setProperty('visibility', 'hidden', 'important');
          el.remove();
        });
      } catch {}
    };

    removeMatches();

    if (typeof MutationObserver !== 'undefined' && document.documentElement) {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) {
              const el = node as HTMLElement;
              const cls = el.className;
              const id = el.id;
              if (
                (typeof cls === 'string' &&
                  (cls.includes('VIpgJd') ||
                    cls.includes('goog-te-spinner') ||
                    cls.includes('goog-te-gadget-icon') ||
                    cls.includes('goog-te-banner'))) ||
                (typeof id === 'string' && (id.includes('goog-gt-tt') || id.includes('goog-te-')))
              ) {
                el.style.setProperty('display', 'none', 'important');
                el.style.setProperty('visibility', 'hidden', 'important');
                el.remove();
              }
            }
          }
        }
      });

      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', suppressTranslateSpinner);
  } else {
    suppressTranslateSpinner();
  }
}

// Auto-run on import
setupDomTranslateSafety();
