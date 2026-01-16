import { Translations } from './types';

export const translations: Translations = {
  // Navigation
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.chat': { ar: 'المحادثة الآلية', en: 'AI Chat' },
  'nav.admin': { ar: 'لوحة التحكم', en: 'Admin' },
  'nav.login': { ar: 'تسجيل دخول', en: 'Login' },
  'nav.logout': { ar: 'تسجيل خروج', en: 'Logout' },

  // Hero Section
  'hero.welcome': { ar: 'مرحباً بك في دار الائتمان', en: 'Welcome to Dar Aletiman' },
  'hero.subtitle': { ar: 'شريكك المالي الموثوق للإجابات الذكية والحلول السريعة', en: 'Your trusted financial partner for smart answers and quick solutions' },
  'hero.cta': { ar: 'ابدأ المحادثة', en: 'Start Chatting' },

  // Cards & Features
  'card.finance': { ar: 'شروط التمويل', en: 'Financing Terms' },
  'card.finance.desc': { ar: 'تعرف على متطلبات التمويل الشخصي والعقاري', en: 'Learn about personal and mortgage financing requirements' },
  'card.calc': { ar: 'حاسبة الأقساط', en: 'Installment Calculator' },
  'card.calc.desc': { ar: 'احسب قسطك الشهري بناءً على الراتب', en: 'Calculate your monthly installment based on salary' },
  'card.contact': { ar: 'تواصل معنا', en: 'Contact Us' },
  'card.contact.desc': { ar: 'تحدث مع فريق خدمة العملاء مباشرة', en: 'Speak directly with our customer service team' },

  // Chat Interface
  'chat.placeholder': { ar: 'اكتب استفسارك هنا...', en: 'Type your inquiry here...' },
  'chat.welcome': { ar: 'أهلاً بك! أنا المساعد الذكي لدار الائتمان. كيف يمكنني مساعدتك اليوم في خدمات التمويل؟', en: 'Welcome! I am the Dar Aletiman AI Assistant. How can I help you with financing services today?' },
  'chat.sending': { ar: 'جاري الكتابة...', en: 'Typing...' },
  'chat.assistant': { ar: 'المساعد الذكي', en: 'AI Assistant' },
  'chat.online': { ar: 'متصل الآن', en: 'Online' },
  'chat.reset_hint': { ar: 'مسح السجل', en: 'Reset Chat' },
  'chat.copy': { ar: 'نسخ', en: 'Copy' },
  'chat.copied': { ar: 'تم النسخ!', en: 'Copied!' },
  'chat.quick_ask': { ar: 'اسأل بسرعة:', en: 'Quick Ask:' },
  'chat.error.fallback': { ar: 'عذراً، لا أملك إجابة دقيقة في وثائقي الحالية حول هذا الموضوع المحدد.', en: 'Sorry, I don\'t have a precise answer in my current documents regarding this specific topic.' },
  'chat.error.processing': { ar: 'خطأ في معالجة طلبك', en: 'Error processing your request' },
  'chat.reset_confirm': { ar: 'هل تريد مسح سجل المحادثة والبدء من جديد؟', en: 'Do you want to clear chat history and restart?' },

  // Admin Dashboard Global
  'admin.title': { ar: 'لوحة التحكم الذكية', en: 'Intelligent Admin Dashboard' },
  'admin.subtitle': { ar: 'إدارة قاعدة معرفة الذكاء الاصطناعي ومراقبة الأداء', en: 'Manage AI knowledge base and monitor performance' },
  'admin.upload': { ar: 'رفع ملفات التدريب', en: 'Upload Training Files' },
  'admin.activeLearning': { ar: 'التعلم النشط', en: 'Active Learning' },
  'admin.smart_insights': { ar: 'الذكاء التحليلي', en: 'Smart Insights' },
  'admin.data_mgmt': { ar: 'إدارة البيانات', en: 'Data Management' },
  'admin.manage_faqs': { ar: 'إدارة الأسئلة الشائعة', en: 'Manage FAQs' },
  'admin.refresh': { ar: 'تحديث', en: 'Refresh' },
  'admin.status': { ar: 'الحالة', en: 'Status' },
  'admin.active': { ar: 'نشط', en: 'Active' },
  'admin.loading_data': { ar: 'جاري تحميل البيانات...', en: 'Loading data...' },
  'admin.no_data': { ar: 'لا توجد بيانات متاحة حالياً', en: 'No data available yet' },

  // Admin: Knowledge Base Management
  'admin.manage_kb': { ar: 'إدارة قاعدة المعرفة', en: 'Manage Knowledge Base' },
  'admin.no_docs': { ar: 'لا توجد وثائق متاحة حالياً', en: 'No documents found' },
  'admin.date': { ar: 'تاريخ', en: 'Date' },
  'admin.usage': { ar: 'الاستخدام', en: 'Usage' },
  'admin.fragments': { ar: 'أجزاء', en: 'fragments' },
  'admin.kb_stats': { ar: 'إحصائيات قاعدة المعرفة', en: 'Knowledge Base Stats' },
  'admin.kb_note': { ar: 'ملاحظة: يتم تحليل الملفات ودمجها في ذاكرة البوت الذكي.', en: 'Note: Files are parsed and integrated into AI memory.' },
  'login.success': { ar: 'تم تسجيل الدخول بنجاح! أهلاً بك', en: 'Logged in successfully! Welcome back' },

  // Admin: Manual Training & Active Learning
  'admin.unanswered': { ar: 'أسئلة غير مجابة', en: 'Unanswered Questions' },
  'admin.train': { ar: 'تدريب الآن', en: 'Train Now' },
  'admin.manual_train_title': { ar: 'تعلم يدوي مخصص', en: 'Custom Manual Learning' },
  'admin.manual_train_desc': { ar: 'قم بتدريب البوت على سؤال وجواب غير موجودين في الملفات.', en: 'Train the bot on Q&A pairs not found in documents.' },
  'admin.custom_question': { ar: 'السؤال المخصص', en: 'Custom Question' },
  'admin.custom_answer': { ar: 'الجواب المخصص', en: 'Custom Answer' },
  'admin.inputAnswer': { ar: 'أدخل الإجابة الصحيحة...', en: 'Enter the correct answer...' },
  'admin.question': { ar: 'السؤال', en: 'Question' },
  'admin.freq': { ar: 'التكرار', en: 'Freq' },
  'admin.correct_answer': { ar: 'الإجابة الصحيحة', en: 'Correct Answer' },
  'admin.action': { ar: 'الإجراء', en: 'Action' },
  'admin.promote_faq': { ar: 'ترقية لشائع', en: 'Promote to FAQ' },
  'admin.delete_question': { ar: 'حذف السؤال', en: 'Delete Question' },
  'admin.all_answered': { ar: 'تمت الإجابة على جميع الأسئلة! عمل رائع.', en: 'All questions answered! Great job.' },

  // Admin: FAQ Management
  'admin.faq_question': { ar: 'نص السؤال الشائع', en: 'FAQ Question Text' },
  'admin.faq_answer': { ar: 'إجابة السؤال الشائع', en: 'FAQ Answer Content' },
  'admin.add_faq': { ar: 'إضافة سؤال شائع جديد', en: 'Add New FAQ' },
  'admin.edit': { ar: 'تعديل', en: 'Edit' },
  'admin.delete': { ar: 'حذف', en: 'Delete' },
  'admin.save_changes': { ar: 'حفظ التغييرات', en: 'Save Changes' },
  'admin.cancel': { ar: 'إلغاء', en: 'Cancel' },

  // Admin: Insights
  'admin.topic': { ar: 'الموضوع رائج', en: 'Trending Topic' },
  'admin.queries': { ar: 'عدد الاستفسارات', en: 'Total Queries' },
  'admin.insights.analyzing': { ar: 'جاري تحليل اهتمامات العملاء...', en: 'Analyzing customer interests...' },
  'admin.insights.summary': { ar: 'تحليل دلالي لآخر ١٠٠ طلب من العملاء لتحديد الاتجاهات السائدة.', en: 'Semantic analysis of the last 100 queries to identify trends.' },

  // Admin: Upload Section
  'admin.dragdrop': { ar: 'اسحب وأفلت الملفات هنا (PDF, DOCX, TXT)', en: 'Drag & drop files here (PDF, DOCX, TXT)' },
  'admin.files_selected': { ar: 'ملفات تم اختيارها', en: 'files selected' },
  'admin.upload_index': { ar: 'رفع وفهرسة البيانات', en: 'Upload & Index Data' },
  'admin.processing': { ar: 'جاري المعالجة...', en: 'Processing...' },

  // Admin: Login
  'admin.login.title': { ar: 'تسجيل دخول المشرف', en: 'Admin Login' },
  'admin.login.btn': { ar: 'تسجيل الدخول', en: 'Login' },
  'admin.username': { ar: 'اسم المستخدم', en: 'Username' },
  'admin.password': { ar: 'كلمة المرور', en: 'Password' },
  'admin.access_denied': { ar: 'يرجى تسجيل الدخول للوصول', en: 'Please login to access' },

  // Notifications & Feedback
  'success.trained': { ar: 'تم تدريب المساعد بنجاح!', en: 'Assistant trained successfully!' },
  'success.deleted': { ar: 'تم الحذف بنجاح من قاعدة البيانات', en: 'Successfully deleted from database' },
  'success.added': { ar: 'تمت الإضافة بنجاح', en: 'Added successfully' },
  'success.updated': { ar: 'تم التحديث بنجاح', en: 'Updated successfully' },
  'success.login': { ar: 'أهلاً بك مجدداً في لوحة التحكم', en: 'Welcome back to admin dashboard' },
  'success.upload': { ar: 'تم رفع وتحليل الملفات بنجاح!', en: 'Files uploaded and analyzed successfully!' },

  'error.train_failed': { ar: 'فشل تدريب النموذج، يرجى المحاولة لاحقاً', en: 'Model training failed, please try again' },
  'error.delete_failed': { ar: 'لم نتمكن من الحذف، تفقد الاتصال بالخادم', en: 'Could not delete, check server connection' },
  'error.generic': { ar: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً', en: 'An unexpected error occurred, please try again' },
  'error.login_failed': { ar: 'اسم المستخدم أو كلمة المرور غير صحيحة', en: 'Invalid username or password' },
  'error.empty_fields': { ar: 'يرجى ملء جميع الحقول المطلوبة', en: 'Please fill in all required fields' },
  'error.empty_answer': { ar: 'يرجى إدخال إجابة قبل التدريب', en: 'Please enter an answer before training' },

  // Confirmation Modals
  'confirm.title': { ar: 'تأكيد العملية', en: 'Confirm Action' },
  'confirm.yes': { ar: 'نعم، استمر', en: 'Yes, Proceed' },
  'confirm.cancel': { ar: 'تراجع', en: 'Cancel' },
  'confirm.train': { ar: 'هل تريد تدريب البوت على هذه الإجابة المحددة؟', en: 'Do you want to train the bot on this specific answer?' },
  'confirm.delete_doc': { ar: 'سيتم حذف الوثيقة نهائياً، هل أنت متأكد؟', en: 'This document will be permanently deleted, sure?' },
  'confirm.delete_faq': { ar: 'هل تريد حذف هذا السؤال السريع؟', en: 'Do you want to delete this FAQ chip?' },
  'confirm.delete_question': { ar: 'سيتم مسح هذا السؤال من قائمة التعلم، هل أنت متأكد؟', en: 'This question will be removed from learning list, proceed?' },
  'confirm.manual_train': { ar: 'هل تريد إضافة هذا السؤال والجواب يدوياً لذاكرة البوت؟', en: 'Do you want to manually add this Q&A to bot memory?' },

  // Footer & Miscellaneous
  'footer.rights': { ar: 'كل الحقوق محفوظة لجدار الائتمان ٢٠٢٤ ©', en: 'Dar Aletiman. All rights reserved 2024 ©' },
  'footer.privacy': { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
  'footer.terms': { ar: 'شروط الخدمة', en: 'Terms of Service' },
  'logo.name': { ar: 'دار الائتمان', en: 'Dar Aletiman' },
  'logo.slogan': { ar: 'الحلول التمويلية', en: 'Financial Solutions' },
  'admin.count': { ar: 'العدد', en: 'Count' },
  'admin.export_csv': { ar: 'تصدير CSV', en: 'Export CSV' },
  'admin.no_unanswered_desc': { ar: 'لا توجد أسئلة معلقة. عمل ممتاز في المتابعة!', en: 'There are no outstanding questions. Great job keeping up!' },
  'admin.manual_training': { ar: 'تدريب مخصص (إضافة سؤال وجواب جديد)', en: 'Custom Training (Add New Q&A)' },
  'admin.train_now': { ar: 'تدريب النموذج الآن', en: 'Train Model Now' },
  'admin.error_empty_fields': { ar: 'يرجى تعبئة جميع الحقول المطلوبة', en: 'Please fill in all required fields' },
  '404.title': { ar: '٤٠٤ - عذراً، لقد تهت!', en: '404 - Oops, You\'re Lost!' },
  '404.subtitle': { ar: 'يبدو أنك وصلت لصفحة غير موجودة في أروقة دار الائتمان الرقمية.', en: 'It seems you\'ve reached a page that doesn\'t exist here.' },
  '404.cta': { ar: 'العودة للمسار الصحيح', en: 'Take Me Home' },
};