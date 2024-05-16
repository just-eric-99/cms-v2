import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { z } from 'zod'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { createRoleSchema } from '@/pages/Roles/_data/schema.ts'
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Permission, Scope } from '@/enum/exercisePermission.ts'
import { Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'

export default function RoleCreateForm() {
  const form = useFormContext<z.infer<typeof createRoleSchema>>()
  const rolePermissionsFieldArray = useFieldArray({
    name: 'permissions',
    control: form.control,
  })
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
                <Input {...field} placeholder='chinese name' />
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
                <Input {...field} placeholder='title (english)' />
              </FormControl>
              <FormMessage className='col-span-5 col-start-3' />
            </FormItem>
          )}
        />
        <Card>
          <CardHeader>
            <div className={'flex flex-row justify-between'}>
              <div className='text-xl font-bold'>Role Permissions</div>
              <Button
                onClick={() => {
                  rolePermissionsFieldArray.append({
                    permission: Permission.USER_READ,
                    scope: Scope.CENTER,
                  })
                }}
                size={'icon'}
              >
                <Plus />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className={'flex flex-col gap-6 pt-2'}>
              {rolePermissionsFieldArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className={'flex w-full flex-row items-center gap-2'}
                >
                  <Controller
                    control={form.control}
                    name={`permissions.${index}.permission`}
                    render={({ field, fieldState }) => (
                      <FormControl>
                        <FormItem className={'flex-1'}>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Select Permission' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {[
                                  Permission.ADMIN_READ,
                                  Permission.ADMIN_EDIT,
                                  Permission.USER_READ,
                                  Permission.USER_EDIT,
                                  Permission.ASSIGN_EXERCISE,
                                ].map((permission) => (
                                  <SelectItem
                                    value={permission}
                                    key={permission}
                                  >
                                    {permission}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage {...field} />

                          {fieldState.error && (
                            <p
                              className={'text-sm font-medium text-destructive'}
                            >
                              {fieldState.error?.message}
                            </p>
                          )}
                        </FormItem>
                      </FormControl>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name={`permissions.${index}.scope`}
                    render={({ field, fieldState }) => (
                      <FormControl>
                        <FormItem className={'flex-1'}>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Select Scope' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {[
                                  Scope.ALL,
                                  Scope.CENTER,
                                  Scope.ORGANIZATION,
                                ].map((scope) => (
                                  <SelectItem value={scope} key={scope}>
                                    {scope}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage {...field} />

                          {fieldState.error && (
                            <p
                              className={'text-sm font-medium text-destructive'}
                            >
                              {fieldState.error?.message}
                            </p>
                          )}
                        </FormItem>
                      </FormControl>
                    )}
                  />

                  <Button
                    variant={'destructive'}
                    onClick={() => rolePermissionsFieldArray.remove(index)}
                    size={'icon'}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Form>
  )
}
