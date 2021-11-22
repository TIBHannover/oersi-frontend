import { useTranslation } from 'next-i18next';

export const Test = () => {
  const { t } = useTranslation('translation');

  return (
    <footer>
      <p>{t('COOKIE.BUTTON_ACCEPT')}</p>
    </footer>
  );
};