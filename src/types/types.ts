import { SERVICES } from './enums'
// view only for a sheet

export type DataTable = {
  uuid: string
  name: string
  ethnicity: string
  gender: string
  ageGroup: AGEGROUP
  benefits: {
    name: SERVICES
    value: number
  }[]
  createAt: string
  updatedAt: string
  stayDuration?: {
    start: string
    end: string
  }
}

export enum AGEGROUP {
  'MINOR' = 'minor',
  'ADULT' = 'adult',
  'SENIOR' = 'senior',
}

export type BaseQueue = {
  type: SERVICES
  name: string
  uuid: string
  createdAt: string
}

export type ServiceLog = {
  uuid: string
  name: string
  service: SERVICES
  createdAt: string
}
