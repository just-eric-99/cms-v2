import { Controller, useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { createExerciseSchema } from '../_data/schema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getAllCenters } from '@/network/centers/api'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { ExercisePermission } from '@/enum/exercisePermission.ts'
import Loader from '@/components/loader.tsx'
import { getAllOrganization } from '@/network/organization/api.ts'
import { RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { generateVoice } from '@/network/text-to-speech/api.ts'
import { useState } from 'react'
import AudioPlayer from "@/components/audio-player.tsx";
import {useParams} from "react-router-dom";

type UpdateExerciseFormProps = {
  canEdit?: boolean
}

export default function UpdateExerciseForm(props: UpdateExerciseFormProps) {
  const { id } = useParams()
  const form = useFormContext<z.infer<typeof createExerciseSchema>>()

  // const queryClient = useQueryClient()

  const organizationQuery = useQuery({
    queryKey: ['organizations'],
    queryFn: getAllOrganization,
  })

  const centerQuery = useQuery({
    queryKey: ['centers'],
    queryFn: getAllCenters,
  })

  const [audioGenerated, setAudioGenerated] = useState<boolean>(false)
  const [filename, setFilename] = useState<string>('')

  const generateVoiceFromTextMutation = useMutation({
    mutationFn: generateVoice,
    onSuccess: (data) => {
      setAudioGenerated(true)
      console.log('data', data)
      setFilename(data.filename)
      form.setValue('voiceFilename', data.filename)
    },
  })

  if (centerQuery.isLoading || organizationQuery.isLoading) {
    return <Loader />
  }

  return (
    <Form {...form}>
      <div className='flex flex-1 flex-col justify-start gap-8'>
        <Controller
          control={form.control}
          name='organizationId'
          render={({ field, fieldState }) => {
            return (
              <FormControl>
                <FormItem>
                  <Label className={fieldState.error && 'text-destructive'}>
                    Organisation
                  </Label>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={props.canEdit != undefined && !props.canEdit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select Organisation' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {organizationQuery.data?.map((org) => (
                          <SelectItem value={org.id} key={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage {...field} />

                  {fieldState.error && (
                    <p className={'text-sm font-medium text-destructive'}>
                      {fieldState.error?.message}
                    </p>
                  )}
                </FormItem>
              </FormControl>
            )
          }}
        />

        <Controller
          control={form.control}
          name='centerId'
          render={({ field, fieldState }) => {
            return (
              <FormControl>
                <FormItem>
                  <Label className={fieldState.error && 'text-destructive'}>
                    Center
                  </Label>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={props.canEdit != undefined && !props.canEdit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select Center' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {centerQuery.data
                          ?.filter((center) => {
                            if (form.watch('organizationId') === undefined) {
                              return false
                            }
                            return (
                              form.watch('organizationId') ===
                              center.organizationId
                            )
                          })
                          ?.map((center) => (
                            <SelectItem value={center.id} key={center.id}>
                              {center.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage {...field} />

                  {fieldState.error && (
                    <p className={'text-sm font-medium text-destructive'}>
                      {fieldState.error?.message}
                    </p>
                  )}
                </FormItem>
              </FormControl>
            )
          }}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='e.g. Warm Up Exercise'
                  {...field}
                  disabled={props.canEdit != undefined && !props.canEdit}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <div className={'flex flex-row  space-x-2'}>
                  <Textarea
                    placeholder='e.g. Warm up exercise for beginners'
                    {...field}
                    disabled={props.canEdit != undefined && !props.canEdit}
                  />
                  {(props.canEdit == undefined || props.canEdit) &&
                    field.value != '' && (
                      <Button
                        disabled={field.value === ''}
                        size={'icon'}
                        onClick={() => {
                          generateVoiceFromTextMutation.mutate({
                            text: field.value,
                          })
                        }}
                      >
                        <RefreshCcw />
                      </Button>
                    )}
                </div>
              </FormControl>
              {audioGenerated ? (
                <AudioPlayer filename={filename} />
              ) : (
                <AudioPlayer exerciseId={id} />
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='difficulty'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty - {field.value}</FormLabel>
              <FormControl>
                <Slider
                  disabled={props.canEdit != undefined && !props.canEdit}
                  min={1}
                  max={10}
                  name='difficulty'
                  value={[field.value]}
                  onValueChange={(values: number[]) => {
                    form.setValue('difficulty', values[0])
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          control={form.control}
          name='permission'
          render={({ field, fieldState }) => {
            return (
              <FormControl>
                <FormItem>
                  <Label className={fieldState.error && 'text-destructive'}>
                    Permission
                  </Label>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                    disabled={props.canEdit != undefined && !props.canEdit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select Permission' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {[
                          ExercisePermission.PRIVATE,
                          ExercisePermission.PROTECTED,
                          ExercisePermission.PROTECTED_READ_ONLY,
                          ExercisePermission.PUBLIC,
                          ExercisePermission.PUBLIC_READ_ONLY,
                        ].map((perm) => (
                          <SelectItem value={perm.toString()} key={perm}>
                            {perm}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage {...field} />

                  {fieldState.error && (
                    <p className={'text-sm font-medium text-destructive'}>
                      {fieldState.error?.message}
                    </p>
                  )}
                </FormItem>
              </FormControl>
            )
          }}
        />
      </div>
    </Form>
  )
}
