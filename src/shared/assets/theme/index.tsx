import { ThemeConfig } from 'antd'

const colors = {
  primary:        '#f97316',
  primaryDark:    '#ea580c',
  primaryLight:   '#fed7aa',
  secondary:      '#64748b',
  success:        '#10b981',
  heading:        '#1f2937',
  text:           '#374151',
  border:         'rgba(0,0,0,0.08)',
  white:          '#ffffff',
  glass:          'rgba(255,255,255,0.90)',
} as const

const theme: ThemeConfig = {
  token: {
    colorPrimary:        colors.primary,
    colorSuccess:        colors.success,
    colorInfo:           colors.primary,
    colorLink:           colors.primary,
    colorText:           colors.text,
    colorTextHeading:    colors.heading,
    colorBorder:         colors.border,
    colorBgBase:         colors.white,
    borderRadius:        8,
    fontFamily:          'var(--font-sfpro), Inter, sans-serif',
  },

  components: {
    Button: {
      borderRadius: 12,
      defaultBg: colors.white,
      defaultColor: colors.primary,
      defaultBorderColor: colors.primary,
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryDark,
      primaryShadow: 'none',
      motionDurationMid: '0.3s',
    },

    Input: {
      borderRadius: 12,
      paddingBlock: 10,
      paddingInline: 12,
      colorBgContainer: colors.glass,
      activeShadow: '0 0 0 2px rgba(249, 115, 22, 0.20)',
    },
    Select: {
      borderRadius: 12,
      optionSelectedBg: colors.primaryLight,
    },
    DatePicker: {
      borderRadius: 12,
      colorPrimary: colors.primary,
      cellActiveWithRangeBg: colors.primaryLight,
    },

    Modal: {
      borderRadiusLG: 20,
      titleFontSize: 24,
      fontWeightStrong: 500,
      headerBg: colors.white,
      contentBg: colors.glass,
      footerBg: colors.white,
    },

    Menu: {
      itemBorderRadius: 8,
      itemHoverBg: colors.primaryLight,
      itemSelectedBg: colors.primary,
      itemSelectedColor: colors.white,
    },
    Layout: {
      siderBg: 'transparent',
      headerBg: 'transparent',
      headerColor: 'inherit',
      bodyBg: '#F4F8FF',
      headerHeight: 'auto',
    },

    Tag: {
      defaultColor: colors.primary,
      defaultBg: colors.primaryLight,
    },

    Badge: {
      dotSize: 8,
      statusSize: 8,
    },
  },
}

export default theme
