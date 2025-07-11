import React from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const SearchPage = () => {
  const location = useLocation()
  const { t } = useTranslation();
  console.log("location",location)
  return (
    <div>
      {t('SearchPage')}
    </div>
  )
}

export default SearchPage
