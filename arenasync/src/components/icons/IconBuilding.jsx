function IconBuilding({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 22V12h6v10" />
      <path d="M9 7h1" /><path d="M14 7h1" />
      <path d="M9 11h1" /><path d="M14 11h1" />
    </svg>
  )
}
export default IconBuilding