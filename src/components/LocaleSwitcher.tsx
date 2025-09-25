import {useLocale, useTranslations} from 'next-intl';
import {locales} from '@/i18n/config';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={locales.map((cur) => ({
        value: cur,
        label: t(cur)
      }))}
      label={t('label')}
    />
  );
}
