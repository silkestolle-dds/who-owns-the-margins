
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Search.svelte generated by Svelte v3.59.2 */

    const file$6 = "src/Search.svelte";

    function create_fragment$6(ctx) {
    	let form;
    	let label;
    	let t1;
    	let input;
    	let t2;
    	let button;

    	const block = {
    		c: function create() {
    			form = element("form");
    			label = element("label");
    			label.textContent = "Search:";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			button = element("button");
    			button.textContent = "Go!";
    			attr_dev(label, "for", "search");
    			add_location(label, file$6, 5, 1, 44);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "search");
    			add_location(input, file$6, 6, 1, 82);
    			add_location(button, file$6, 7, 1, 117);
    			attr_dev(form, "class", "search");
    			add_location(form, file$6, 4, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, label);
    			append_dev(form, t1);
    			append_dev(form, input);
    			append_dev(form, t2);
    			append_dev(form, button);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Header.svelte generated by Svelte v3.59.2 */
    const file$5 = "src/Header.svelte";

    function create_fragment$5(ctx) {
    	let div2;
    	let h1;
    	let t1;
    	let div1;
    	let nav;
    	let a0;
    	let t3;
    	let a1;
    	let t5;
    	let a2;
    	let t7;
    	let div0;
    	let search;
    	let current;
    	search = new Search({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "@ Logo";
    			t1 = space();
    			div1 = element("div");
    			nav = element("nav");
    			a0 = element("a");
    			a0.textContent = "My Account";
    			t3 = space();
    			a1 = element("a");
    			a1.textContent = "Wishlist";
    			t5 = space();
    			a2 = element("a");
    			a2.textContent = "Basket";
    			t7 = space();
    			div0 = element("div");
    			create_component(search.$$.fragment);
    			attr_dev(h1, "class", "header__logo");
    			add_location(h1, file$5, 5, 1, 80);
    			attr_dev(a0, "href", "#top");
    			attr_dev(a0, "class", "svelte-f7io3b");
    			add_location(a0, file$5, 8, 3, 179);
    			attr_dev(a1, "href", "#top");
    			attr_dev(a1, "class", "svelte-f7io3b");
    			add_location(a1, file$5, 11, 3, 221);
    			attr_dev(a2, "href", "#top");
    			attr_dev(a2, "class", "svelte-f7io3b");
    			add_location(a2, file$5, 14, 3, 261);
    			attr_dev(nav, "class", "meta__nav svelte-f7io3b");
    			add_location(nav, file$5, 7, 2, 152);
    			attr_dev(div0, "class", "meta__search svelte-f7io3b");
    			add_location(div0, file$5, 18, 2, 307);
    			attr_dev(div1, "class", "header__meta meta");
    			add_location(div1, file$5, 6, 1, 118);
    			attr_dev(div2, "class", "header svelte-f7io3b");
    			add_location(div2, file$5, 4, 0, 58);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, nav);
    			append_dev(nav, a0);
    			append_dev(nav, t3);
    			append_dev(nav, a1);
    			append_dev(nav, t5);
    			append_dev(nav, a2);
    			append_dev(div1, t7);
    			append_dev(div1, div0);
    			mount_component(search, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(search);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Search });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Newsletter.svelte generated by Svelte v3.59.2 */

    const file$4 = "src/Newsletter.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let a;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Get 5% discount and subscribe to our newsletter!";
    			t1 = text("\t\n\t» ");
    			a = element("a");
    			a.textContent = "Subscribe today";
    			attr_dev(h3, "class", "newsletter__headline svelte-10a8rp4");
    			add_location(h3, file$4, 6, 1, 48);
    			attr_dev(a, "href", "/newsletter");
    			add_location(a, file$4, 7, 9, 145);
    			attr_dev(div, "class", "newsletter svelte-10a8rp4");
    			add_location(div, file$4, 5, 0, 22);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, a);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Newsletter', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Newsletter> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Newsletter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Newsletter",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.59.2 */
    const file$3 = "src/Footer.svelte";

    function create_fragment$3(ctx) {
    	let footer;
    	let ul0;
    	let li0;
    	let t0;
    	let a0;
    	let t2;
    	let li1;
    	let t3;
    	let a1;
    	let t5;
    	let li2;
    	let t6;
    	let a2;
    	let t8;
    	let ul1;
    	let li3;
    	let t9;
    	let a3;
    	let t11;
    	let li4;
    	let t12;
    	let a4;
    	let t14;
    	let li5;
    	let t15;
    	let a5;
    	let t17;
    	let div;
    	let newsletter;
    	let current;
    	newsletter = new Newsletter({ $$inline: true });

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			ul0 = element("ul");
    			li0 = element("li");
    			t0 = text("» ");
    			a0 = element("a");
    			a0.textContent = "News";
    			t2 = space();
    			li1 = element("li");
    			t3 = text("» ");
    			a1 = element("a");
    			a1.textContent = "Contact";
    			t5 = space();
    			li2 = element("li");
    			t6 = text("» ");
    			a2 = element("a");
    			a2.textContent = "About";
    			t8 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			t9 = text("» ");
    			a3 = element("a");
    			a3.textContent = "Jobs";
    			t11 = space();
    			li4 = element("li");
    			t12 = text("» ");
    			a4 = element("a");
    			a4.textContent = "Imprint";
    			t14 = space();
    			li5 = element("li");
    			t15 = text("» ");
    			a5 = element("a");
    			a5.textContent = "Compliance";
    			t17 = space();
    			div = element("div");
    			create_component(newsletter.$$.fragment);
    			attr_dev(a0, "href", "news");
    			add_location(a0, file$3, 6, 15, 138);
    			attr_dev(li0, "class", "svelte-1c8x6ed");
    			add_location(li0, file$3, 6, 3, 126);
    			attr_dev(a1, "href", "news");
    			add_location(a1, file$3, 7, 15, 182);
    			attr_dev(li1, "class", "svelte-1c8x6ed");
    			add_location(li1, file$3, 7, 3, 170);
    			attr_dev(a2, "href", "about");
    			add_location(a2, file$3, 8, 15, 229);
    			attr_dev(li2, "class", "svelte-1c8x6ed");
    			add_location(li2, file$3, 8, 3, 217);
    			attr_dev(ul0, "class", "footer__linklist svelte-1c8x6ed");
    			add_location(ul0, file$3, 5, 2, 93);
    			attr_dev(a3, "href", "news");
    			add_location(a3, file$3, 11, 15, 315);
    			attr_dev(li3, "class", "svelte-1c8x6ed");
    			add_location(li3, file$3, 11, 3, 303);
    			attr_dev(a4, "href", "news");
    			add_location(a4, file$3, 12, 15, 359);
    			attr_dev(li4, "class", "svelte-1c8x6ed");
    			add_location(li4, file$3, 12, 3, 347);
    			attr_dev(a5, "href", "news");
    			add_location(a5, file$3, 13, 15, 406);
    			attr_dev(li5, "class", "svelte-1c8x6ed");
    			add_location(li5, file$3, 13, 3, 394);
    			attr_dev(ul1, "class", "footer__linklist svelte-1c8x6ed");
    			add_location(ul1, file$3, 10, 2, 270);
    			attr_dev(div, "class", "footer__teaser");
    			add_location(div, file$3, 15, 2, 451);
    			attr_dev(footer, "class", "footer svelte-1c8x6ed");
    			add_location(footer, file$3, 4, 0, 67);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, t0);
    			append_dev(li0, a0);
    			append_dev(ul0, t2);
    			append_dev(ul0, li1);
    			append_dev(li1, t3);
    			append_dev(li1, a1);
    			append_dev(ul0, t5);
    			append_dev(ul0, li2);
    			append_dev(li2, t6);
    			append_dev(li2, a2);
    			append_dev(footer, t8);
    			append_dev(footer, ul1);
    			append_dev(ul1, li3);
    			append_dev(li3, t9);
    			append_dev(li3, a3);
    			append_dev(ul1, t11);
    			append_dev(ul1, li4);
    			append_dev(li4, t12);
    			append_dev(li4, a4);
    			append_dev(ul1, t14);
    			append_dev(ul1, li5);
    			append_dev(li5, t15);
    			append_dev(li5, a5);
    			append_dev(footer, t17);
    			append_dev(footer, div);
    			mount_component(newsletter, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(newsletter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(newsletter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_component(newsletter);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Newsletter });
    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Aside.svelte generated by Svelte v3.59.2 */
    const file$2 = "src/Aside.svelte";

    function create_fragment$2(ctx) {
    	let div6;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div1;
    	let search;
    	let t1;
    	let div2;
    	let img1;
    	let img1_src_value;
    	let t2;
    	let div3;
    	let newsletter;
    	let t3;
    	let div4;
    	let img2;
    	let img2_src_value;
    	let t4;
    	let div5;
    	let img3;
    	let img3_src_value;
    	let current;
    	search = new Search({ $$inline: true });
    	newsletter = new Newsletter({ $$inline: true });

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div1 = element("div");
    			create_component(search.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			img1 = element("img");
    			t2 = space();
    			div3 = element("div");
    			create_component(newsletter.$$.fragment);
    			t3 = space();
    			div4 = element("div");
    			img2 = element("img");
    			t4 = space();
    			div5 = element("div");
    			img3 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = "https://placehold.co/200x101?text=Some%20Ads")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "some ads");
    			attr_dev(img0, "class", "svelte-fj2zlu");
    			add_location(img0, file$2, 6, 24, 151);
    			attr_dev(div0, "class", "aside__ad svelte-fj2zlu");
    			add_location(div0, file$2, 6, 1, 128);
    			attr_dev(div1, "class", "aside__search svelte-fj2zlu");
    			add_location(div1, file$2, 7, 1, 232);
    			if (!src_url_equal(img1.src, img1_src_value = "https://placehold.co/200x100?text=Some%20Ads")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "some ads");
    			attr_dev(img1, "class", "svelte-fj2zlu");
    			add_location(img1, file$2, 10, 24, 305);
    			attr_dev(div2, "class", "aside__ad svelte-fj2zlu");
    			add_location(div2, file$2, 10, 1, 282);
    			attr_dev(div3, "class", "aside__newsletter svelte-fj2zlu");
    			add_location(div3, file$2, 11, 1, 386);
    			if (!src_url_equal(img2.src, img2_src_value = "https://placehold.co/200x100?text=Some%20Ads")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "some ads");
    			attr_dev(img2, "class", "svelte-fj2zlu");
    			add_location(img2, file$2, 14, 24, 467);
    			attr_dev(div4, "class", "aside__ad svelte-fj2zlu");
    			add_location(div4, file$2, 14, 1, 444);
    			if (!src_url_equal(img3.src, img3_src_value = "https://placehold.co/200x100?text=Some%20Ads")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "some ads");
    			attr_dev(img3, "class", "svelte-fj2zlu");
    			add_location(img3, file$2, 15, 24, 571);
    			attr_dev(div5, "class", "aside__ad svelte-fj2zlu");
    			add_location(div5, file$2, 15, 1, 548);
    			attr_dev(div6, "class", "aside svelte-fj2zlu");
    			add_location(div6, file$2, 5, 0, 107);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);
    			append_dev(div0, img0);
    			append_dev(div6, t0);
    			append_dev(div6, div1);
    			mount_component(search, div1, null);
    			append_dev(div6, t1);
    			append_dev(div6, div2);
    			append_dev(div2, img1);
    			append_dev(div6, t2);
    			append_dev(div6, div3);
    			mount_component(newsletter, div3, null);
    			append_dev(div6, t3);
    			append_dev(div6, div4);
    			append_dev(div4, img2);
    			append_dev(div6, t4);
    			append_dev(div6, div5);
    			append_dev(div5, img3);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search.$$.fragment, local);
    			transition_in(newsletter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search.$$.fragment, local);
    			transition_out(newsletter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_component(search);
    			destroy_component(newsletter);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Aside', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Aside> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Newsletter, Search });
    	return [];
    }

    class Aside extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Aside",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Teasers.svelte generated by Svelte v3.59.2 */

    const file$1 = "src/Teasers.svelte";

    function create_fragment$1(ctx) {
    	let div3;
    	let div0;
    	let h20;
    	let t1;
    	let p0;
    	let t3;
    	let div1;
    	let h21;
    	let t5;
    	let p1;
    	let t7;
    	let div2;
    	let h22;
    	let t9;
    	let p2;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Less is more";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Presentation about our updated diconium frontend guidelines";
    			t3 = space();
    			div1 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Who owns the margins?!";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Create re-usable components and their outerspacings based on context.";
    			t7 = space();
    			div2 = element("div");
    			h22 = element("h2");
    			h22.textContent = "React Performance Part 2";
    			t9 = space();
    			p2 = element("p");
    			p2.textContent = "Done by Stefan Winkler 🤘";
    			add_location(h20, file$1, 6, 2, 77);
    			add_location(p0, file$1, 7, 2, 101);
    			attr_dev(div0, "class", "template__box1 svelte-1g6frn9");
    			add_location(div0, file$1, 5, 1, 46);
    			add_location(h21, file$1, 10, 2, 208);
    			add_location(p1, file$1, 11, 2, 242);
    			attr_dev(div1, "class", "template__box2 svelte-1g6frn9");
    			add_location(div1, file$1, 9, 1, 177);
    			add_location(h22, file$1, 14, 2, 359);
    			add_location(p2, file$1, 15, 2, 395);
    			attr_dev(div2, "class", "template__box3 svelte-1g6frn9");
    			add_location(div2, file$1, 13, 1, 328);
    			attr_dev(div3, "class", "template svelte-1g6frn9");
    			add_location(div3, file$1, 4, 0, 22);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, h20);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			append_dev(div1, h21);
    			append_dev(div1, t5);
    			append_dev(div1, p1);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, h22);
    			append_dev(div2, t9);
    			append_dev(div2, p2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Teasers', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Teasers> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Teasers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Teasers",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div3;
    	let header1;
    	let header0;
    	let t0;
    	let main;
    	let section;
    	let div0;
    	let h1;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let p;
    	let t6;
    	let div1;
    	let newsletter;
    	let t7;
    	let div2;
    	let teasers;
    	let t8;
    	let aside1;
    	let aside0;
    	let t9;
    	let footer1;
    	let footer0;
    	let current;
    	header0 = new Header({ $$inline: true });
    	newsletter = new Newsletter({ $$inline: true });
    	teasers = new Teasers({ $$inline: true });
    	aside0 = new Aside({ $$inline: true });
    	footer0 = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			header1 = element("header");
    			create_component(header0.$$.fragment);
    			t0 = space();
    			main = element("main");
    			section = element("section");
    			div0 = element("div");
    			h1 = element("h1");
    			t1 = text("Hello ");
    			t2 = text(/*name*/ ctx[0]);
    			t3 = text("!");
    			t4 = space();
    			p = element("p");
    			p.textContent = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
    			t6 = space();
    			div1 = element("div");
    			create_component(newsletter.$$.fragment);
    			t7 = space();
    			div2 = element("div");
    			create_component(teasers.$$.fragment);
    			t8 = space();
    			aside1 = element("aside");
    			create_component(aside0.$$.fragment);
    			t9 = space();
    			footer1 = element("footer");
    			create_component(footer0.$$.fragment);
    			add_location(header1, file, 11, 0, 262);
    			add_location(h1, file, 17, 3, 388);
    			add_location(p, file, 18, 3, 414);
    			attr_dev(div0, "class", "content content__intro svelte-jrgnes");
    			add_location(div0, file, 16, 2, 348);
    			attr_dev(div1, "class", "content__newsletter svelte-jrgnes");
    			add_location(div1, file, 20, 2, 1024);
    			attr_dev(div2, "class", "content__teasers svelte-jrgnes");
    			add_location(div2, file, 23, 2, 1087);
    			attr_dev(section, "class", "main__content svelte-jrgnes");
    			add_location(section, file, 15, 1, 314);
    			attr_dev(aside1, "class", "main__aside svelte-jrgnes");
    			add_location(aside1, file, 27, 1, 1155);
    			attr_dev(main, "class", "main svelte-jrgnes");
    			add_location(main, file, 14, 0, 293);
    			add_location(footer1, file, 31, 0, 1213);
    			attr_dev(div3, "class", "app svelte-jrgnes");
    			add_location(div3, file, 10, 0, 244);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, header1);
    			mount_component(header0, header1, null);
    			append_dev(div3, t0);
    			append_dev(div3, main);
    			append_dev(main, section);
    			append_dev(section, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(div0, t4);
    			append_dev(div0, p);
    			append_dev(section, t6);
    			append_dev(section, div1);
    			mount_component(newsletter, div1, null);
    			append_dev(section, t7);
    			append_dev(section, div2);
    			mount_component(teasers, div2, null);
    			append_dev(main, t8);
    			append_dev(main, aside1);
    			mount_component(aside0, aside1, null);
    			append_dev(div3, t9);
    			append_dev(div3, footer1);
    			mount_component(footer0, footer1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t2, /*name*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header0.$$.fragment, local);
    			transition_in(newsletter.$$.fragment, local);
    			transition_in(teasers.$$.fragment, local);
    			transition_in(aside0.$$.fragment, local);
    			transition_in(footer0.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header0.$$.fragment, local);
    			transition_out(newsletter.$$.fragment, local);
    			transition_out(teasers.$$.fragment, local);
    			transition_out(aside0.$$.fragment, local);
    			transition_out(footer0.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(header0);
    			destroy_component(newsletter);
    			destroy_component(teasers);
    			destroy_component(aside0);
    			destroy_component(footer0);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	});

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		Header,
    		Footer,
    		Aside,
    		Teasers,
    		Newsletter
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
