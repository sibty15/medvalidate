import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-gray-300 placeholder:text-gray-400 focus-visible:border-[#f59f0a] focus-visible:ring-[#f59f0a]/30 aria-invalid:ring-red-500/20 aria-invalid:border-red-600 flex field-sizing-content min-h-16 w-full rounded-md border-2 bg-white px-3 py-2 text-base text-gray-900 shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
