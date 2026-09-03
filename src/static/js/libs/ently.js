const dom = document;

function $(context, selector) {
    if (typeof context === 'string') {
        return document.querySelector(context);
    }

    return context.querySelector(selector);
}

function $a(context, selector) {
    if (typeof context === 'string') {
        return document.querySelectorAll(context);
    }

    return context.querySelectorAll(selector);
}

function render(html) {
    const voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

    return html
        .replace(/<!--[\s\S]*?-->/g, '')

        .replace(/<([A-Z][\w]*)\s*\/>/g, (m, name) => {
            const comp = globalThis[name];

            if (typeof comp === 'function') {
                const res = comp();

                if (typeof res === 'string') return res;
                if (res?.str) return res.str();
            }

            return '';
        })

        .replace(/<([a-zA-Z][\w-]*)([^>]*)\/>/g, (m, tag, attrs) => {
            tag = tag.toLowerCase();
            if (voidTags.includes(tag)) {
                return `<${tag}${attrs}>`;
            }
            return `<${tag}${attrs}></${tag}>`;
        })

        .replace(/\n+/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function elem(tag, attrs = {}) {
    let el, html;

    if (tag.trim().startsWith('<')) {
        html = render(tag);
        const tp = document.createElement('template');
        tp.innerHTML = html;
        el = tp.content.firstElementChild;
    } else {
        el = document.createElement(tag);
        html = `<${tag}></${tag}>`;
    }

    if (attrs) {
        for (const [key, value] of Object.entries(attrs)) {
            if (key === "style" && typeof value === "object") Object.assign(el.style, value);
            else if (key === "parent") value.appendChild(el);
            else if (key === "text") el.textContent = value;
            else if (key === "children" && Array.isArray(value)) value.forEach(child => child && el.append(child)); 
            else if (key === "inner") el.innerHTML = render(value);
            else el.setAttribute(key, value);
        }
    }

    el.str = () => html;

    return el;
}