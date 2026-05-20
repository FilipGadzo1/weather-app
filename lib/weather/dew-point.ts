export interface DewPointComfort {
  label: 'Dry' | 'Comfortable' | 'Noticeable' | 'Muggy' | 'Oppressive'
  color: string
  bgColor: string
}

export function getDewPointComfort(dewC: number): DewPointComfort {
  if (!Number.isFinite(dewC)) return { label: 'Dry', color: 'text-sky-300', bgColor: 'bg-sky-500/20' }
  if (dewC < 10)  return { label: 'Dry',         color: 'text-sky-300',    bgColor: 'bg-sky-500/20'    }
  if (dewC < 15)  return { label: 'Comfortable', color: 'text-green-300',  bgColor: 'bg-green-500/20'  }
  if (dewC < 18)  return { label: 'Noticeable',  color: 'text-yellow-300', bgColor: 'bg-yellow-500/20' }
  if (dewC < 21)  return { label: 'Muggy',       color: 'text-orange-300', bgColor: 'bg-orange-500/20' }
  return              { label: 'Oppressive',  color: 'text-red-300',    bgColor: 'bg-red-500/20'    }
}
