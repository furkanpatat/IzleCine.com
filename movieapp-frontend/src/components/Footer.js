import React from 'react'
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      {t('Footer')}
    </div>
  )
}

export default Footer
