import React from 'react'
import { useTranslation } from 'react-i18next';

const ExplorePage = () => {
  const { t } = useTranslation();
  return (
    <div>
      {t('ExplorePage')}
    </div>
  )
}

export default ExplorePage
