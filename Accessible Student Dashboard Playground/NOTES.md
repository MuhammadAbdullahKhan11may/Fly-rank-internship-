# Accessible Component Notes

## Overview

This playground contains three accessible components built manually in React + TypeScript:

- Modal Dialog
- Tabs
- Disclosure

The components were implemented with keyboard interaction, ARIA attributes, and focus management in mind.

---

## Modal Dialog

### What I implemented

My modal includes:

- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby`
- Focus moves into the modal when it opens
- `Tab` stays inside the modal
- `Shift + Tab` stays inside the modal
- `Escape` closes the modal
- Focus returns to the trigger button after closing

### What shadcn handled better

1. **More robust focus management**

My implementation manually finds focusable elements and traps keyboard focus. shadcn handles focus management through its underlying accessibility primitives, which covers more edge cases.

2. **Better handling of outside interaction**

My modal focuses mainly on keyboard trapping and closing behavior. shadcn handles interaction with content outside the dialog more comprehensively.

---

## Tabs

### What I implemented

My tabs include:

- `role="tablist"`
- `role="tab"`
- `role="tabpanel"`
- `aria-selected`
- `aria-controls`
- Left and Right Arrow navigation
- Home and End navigation
- Enter and Space activation
- Roving `tabIndex`

### What shadcn handled better

1. **More complete keyboard and focus behavior**

My version manually controls focus and selected state. shadcn provides more robust handling through its internal primitives.

2. **Better synchronization of state and ARIA relationships**

shadcn manages tab state, focus state, ARIA attributes, and associated tab panels in a more reusable and reliable way.

---

## Disclosure

The disclosure component uses a native `<button>` with:

- `aria-expanded`
- `aria-controls`

Because it uses a native button, keyboard activation with Enter and Space is handled automatically by the browser.

---

## Conclusion

Building these components manually helped me understand the accessibility behavior that UI libraries normally handle automatically. Comparing them with shadcn showed how reusable component libraries provide stronger handling for focus management, keyboard interaction, state synchronization, and accessibility edge cases.