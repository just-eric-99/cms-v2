import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { updateRoleSchema } from '@/pages/Roles/_data/schema.ts'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'

type RoleDetailsFormProps = {
  canEdit: boolean
}

export default function RoleDetailsForm({ canEdit }: RoleDetailsFormProps) {
  const form = useFormContext<z.infer<typeof updateRoleSchema>>()

  return (
    <Form {...form}>
      <div className='flex flex-1 flex-col justify-start gap-5'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel className='col-span-2'>Title (Chinese)</FormLabel>
              <FormControl className='col-span-5'>
                <Input
                  {...field}
                  placeholder='chinese name'
                  disabled={!canEdit}
                />
              </FormControl>
              <FormMessage className='col-span-5 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='titleEn'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel className='col-span-2'>Title (English)</FormLabel>
              <FormControl className='col-span-5'>
                <Input
                  {...field}
                  placeholder='title (english)'
                  disabled={!canEdit}
                />
              </FormControl>
              <FormMessage className='col-span-5 col-start-3' />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}
