import { convertTimeStringToMinutes } from '@/utils/convert-time-strin-to-minutes'
import { z } from 'zod'

export const timeIntervalSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa seleciona pelo menos um dia da semana',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        // let weekDaysError = ''
        // intervals.map((interval, index) => {
        //   const day = {
        //     enabled:
        //       interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        //     weedDay: weekDays[index],
        //   }

        //   if (!day.enabled) {
        //     if (index === intervals.length) {
        //       weekDaysError = weekDaysError + ` ${day.weedDay}`
        //     } else if (weekDaysError === '') {
        //       weekDaysError = weekDaysError + ` ${day.weedDay}`
        //     } else {
        //       weekDaysError = weekDaysError + `, ${day.weedDay}`
        //     }
        //   }

        //   return day
        // })
        // console.log(weekDaysError)
        // TODO SET SPECIFIC ERROR
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        )
      },
      {
        message:
          'O horário de termino deve ser pelo menos uma hora distante do inicio',
      },
    ),
})

export type TimeIntervalOutputSchema = z.output<typeof timeIntervalSchema>
export type TimeIntervalInputSchema = z.input<typeof timeIntervalSchema>
