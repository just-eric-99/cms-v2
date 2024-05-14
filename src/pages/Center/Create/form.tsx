import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getAllOrganization } from '@/network/organization/api'
import { useQuery } from '@tanstack/react-query'
import { useFormContext } from 'react-hook-form'

export default function CenterCreateForm() {
  const form = useFormContext()
  const query = useQuery({
    queryKey: ['organizations'],
    queryFn: getAllOrganization,
  })

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
        />
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <div className='grid grid-cols-7 items-center gap-4 text-end'>
                <FormLabel className='col-span-2'>Address (Chinese)</FormLabel>
                <FormControl className='col-span-5'>
                  <Textarea {...field} placeholder='address (chinese)' />
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
          name='addressEn'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <div className='grid grid-cols-7 items-center gap-4 text-end'>
                <FormLabel className='col-span-2'>Address (English)</FormLabel>
                <FormControl className='col-span-5'>
                  <Textarea {...field} placeholder='address (english)' />
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
          name='organizationId'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <div className='grid grid-cols-7 items-center gap-4 text-end'>
                <FormLabel className='col-span-2'>Organization</FormLabel>
                <div className='col-span-5'>
                  <FormControl className='col-span-5'>
                    <Select onValueChange={(value) => field.onChange(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select Organization' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {query.data?.map((organization) => (
                            <SelectItem
                              value={organization.id}
                              key={organization.id}
                            >
                              {organization.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className='grid grid-cols-7 gap-4'>
                <FormMessage className='col-span-5 col-start-3' />
              </div>
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}
