import { atom, useAtom } from 'jotai'
import { DataTable as DataTableType } from '@/types/types'
// const selectedServer = atom<Server | undefined>(undefined);

// export const useSelectedServer = () => useAtom(selectedServer);

const profileDataAtom = atom<DataTableType | null>(null)

export const useProfileData = () => useAtom(profileDataAtom)

const dataTableAtom = atom<DataTableType[]>([])
export const useDataTable = () => useAtom(dataTableAtom)

const isExpandedAtom = atom(false)
export const useIsExpanded = () => useAtom(isExpandedAtom)
