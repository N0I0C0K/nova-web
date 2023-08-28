import { createContext, useState } from 'react'

const searchContext = createContext<SearchInter>(undefined as any)

export interface SearchInter {
  isShow: boolean
}

const defaultSearchProps: SearchInter = {
  isShow: false,
}

export function SearchProvider({ childern }: { childern: React.ReactNode }) {
  const [searchState, setState] = useState<SearchInter>(defaultSearchProps)
  return (
    <searchContext.Provider value={searchState}>
      {childern}
    </searchContext.Provider>
  )
}
