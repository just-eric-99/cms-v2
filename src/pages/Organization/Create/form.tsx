import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'

export default function OrganizationCreateForm() {
  const form = useFormContext()
  return (
    <Form {...form}>
      <div className='flex flex-1 flex-col justify-start gap-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <div className='grid grid-cols-7 items-center gap-4 text-end'>
                <FormLabel className='col-span-2'>Chinese Name</FormLabel>
                <FormControl className='col-span-5'>
                  <Input {...field} placeholder='chinese name' />
                </FormControl>
              </div>
              <div className='grid grid-cols-7 gap-4'>
                <FormMessage className='col-span-5 col-start-3' />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='nameEn'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <div className='grid grid-cols-7 items-center gap-4 text-end'>
                <FormLabel className='col-span-2'>English Name</FormLabel>
                <FormControl className='col-span-5'>
                  <Input {...field} placeholder='english name' />
                </FormControl>
              </div>
              <div className='grid grid-cols-7 gap-4'>
                <FormMessage className='col-span-5 col-start-3' />
              </div>
            </FormItem>
          )}
        />{' '}
      </div>
    </Form>
  )
}
