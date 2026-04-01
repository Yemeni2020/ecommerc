import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

/**
 * @typedef {Object} LabelProps
 * @property {React.ReactNode} [children]
 * @property {string} [className]
 * @property {React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>} [__labelProps]
 */

/**
 * @type {React.ForwardRefExoticComponent<
 *   (React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & LabelProps) &
 *   React.RefAttributes<React.ElementRef<typeof LabelPrimitive.Root>>
 * >}
 */
const Label = React.forwardRef(function Label({ className, ...props }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    />
  )
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
