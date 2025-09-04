export interface Translations {
  [key: string]: string;
}

export const translations = {
  en: {
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.username': 'Username',
    'auth.loginButton': 'Sign In',
    'auth.registerButton': 'Sign Up',
    'auth.switchToRegister': 'Sign up now',
    'auth.switchToLogin': 'Sign in now',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.loggingIn': 'Signing in...',
    'auth.registering': 'Signing up...',
    
    // App
    'app.title': 'Delivery Driver Address Annotation',
    'app.subtitle': 'Platform for delivery drivers to annotate, rate and share address information',
    'app.welcome': 'Welcome',
    'app.level': 'Level',
    'app.score': 'Score',
    'app.logout': 'Logout',
    
    // Home
    'home.navigation': 'Features',
    'home.mapAnnotation': 'Map Annotation',
    'home.mapAnnotationDesc': 'Annotate delivery addresses on map, add ratings and notes',
    'home.browseAnnotations': 'Browse Annotations',
    'home.browseAnnotationsDesc': 'View address annotations shared by other drivers',
    'home.profile': 'Profile',
    'home.profileDesc': 'View your score, level and followed drivers',
    'home.startAnnotating': 'Start Annotating',
    'home.browseNow': 'Browse Now',
    'home.viewProfile': 'View Profile',
    'home.currentLevel': 'Current Level',
    'home.totalScore': 'Total Score',
    'home.followers': 'Followers',
    
    // Validation
    'validation.required': 'This field is required',
    'validation.email': 'Please enter a valid email',
    'validation.minLength': 'Minimum {0} characters required',
    'validation.maxLength': 'Maximum {0} characters allowed',
    'validation.passwordMismatch': 'Passwords do not match',
  },
  
  zh: {
    // Auth
    'auth.login': '登录',
    'auth.register': '注册',
    'auth.email': '邮箱',
    'auth.password': '密码',
    'auth.confirmPassword': '确认密码',
    'auth.username': '用户名',
    'auth.loginButton': '登录',
    'auth.registerButton': '注册',
    'auth.switchToRegister': '立即注册',
    'auth.switchToLogin': '立即登录',
    'auth.noAccount': '还没有账号？',
    'auth.hasAccount': '已有账号？',
    'auth.loggingIn': '登录中...',
    'auth.registering': '注册中...',
    
    // App
    'app.title': '外卖司机地址标注应用',
    'app.subtitle': '为外卖司机提供地址标注、评分和信息分享的平台',
    'app.welcome': '欢迎',
    'app.level': '等级',
    'app.score': '积分',
    'app.logout': '登出',
    
    // Home
    'home.navigation': '功能导航',
    'home.mapAnnotation': '地图标注',
    'home.mapAnnotationDesc': '在地图上标注配送地址，添加评分和备注信息',
    'home.browseAnnotations': '浏览标注',
    'home.browseAnnotationsDesc': '查看其他司机分享的地址标注信息',
    'home.profile': '个人中心',
    'home.profileDesc': '查看积分、等级和关注的司机',
    'home.startAnnotating': '开始标注',
    'home.browseNow': '浏览标注',
    'home.viewProfile': '个人中心',
    'home.currentLevel': '当前等级',
    'home.totalScore': '总积分',
    'home.followers': '粉丝数量',
    
    // Validation
    'validation.required': '此字段必填',
    'validation.email': '请输入有效的邮箱地址',
    'validation.minLength': '至少需要{0}个字符',
    'validation.maxLength': '最多允许{0}个字符',
    'validation.passwordMismatch': '密码确认不匹配',
  }
};

type Language = 'en' | 'zh';

class I18n {
  private currentLanguage: Language = 'en';

  constructor() {
    // 从localStorage获取语言设置，默认为英语
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
      this.currentLanguage = savedLang;
    } else {
      // 根据浏览器语言自动检测
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('zh')) {
        this.currentLanguage = 'zh';
      }
    }
  }

  t(key: string, params?: string[]): string {
    let text = translations[this.currentLanguage][key] || translations['en'][key] || key;
    
    // 参数替换
    if (params) {
      params.forEach((param, index) => {
        text = text.replace(`{${index}}`, param);
      });
    }
    
    return text;
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(language: Language): void {
    this.currentLanguage = language;
    localStorage.setItem('language', language);
    // 触发语言变更事件
    window.dispatchEvent(new CustomEvent('languageChange', { detail: language }));
  }

  getAvailableLanguages(): { code: Language; name: string }[] {
    return [
      { code: 'en', name: 'English' },
      { code: 'zh', name: '中文' }
    ];
  }
}

export const i18n = new I18n();