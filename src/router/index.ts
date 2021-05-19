import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer.vue')

// Views
// const Dashboard = () => import('@/views/Dashboard')
const Dashboard = () => import('@/views/dashboard/index.vue')
const ExplorePools = () => import('@/views/explore-pools/index.vue')
const Pool = () => import('@/views/explore-pools/Pool.vue')
const CreatePool = () => import('@/views/create-pool/index.vue')
const Exchange = () => import('@/views/exchange/index.vue')

const Wallet = () => import('@/views/wallet/index.vue')

const Colors = () => import('@/views/theme/Colors.vue')
const Typography = () => import('@/views/theme/Typography.vue')

const Charts = () => import('@/views/charts/Charts.vue')
const Widgets = () => import('@/views/widgets/Widgets.vue')

// Views - Components
const Cards = () => import('@/views/base/Cards.vue')
const Switches = () => import('@/views/base/Switches.vue')
const Tabs = () => import('@/views/base/Tabs.vue')
const Breadcrumbs = () => import('@/views/base/Breadcrumbs.vue')
const Carousels = () => import('@/views/base/Carousels.vue')
const Collapses = () => import('@/views/base/Collapses.vue')
const Jumbotrons = () => import('@/views/base/Jumbotrons.vue')
const ListGroups = () => import('@/views/base/ListGroups.vue')
const Navs = () => import('@/views/base/Navs.vue')
const Navbars = () => import('@/views/base/Navbars.vue')
const Paginations = () => import('@/views/base/Paginations.vue')
const Popovers = () => import('@/views/base/Popovers.vue')
const ProgressBars = () => import('@/views/base/ProgressBars.vue')
const Tables = () => import('@/views/tables/Tables.vue')
const AdvancedTables = () => import('@/views/tables/AdvancedTables.vue')
const Tooltips = () => import('@/views/base/Tooltips.vue')

// Views - Buttons
const StandardButtons = () => import('@/views/buttons/StandardButtons.vue')
const ButtonGroups = () => import('@/views/buttons/ButtonGroups.vue')
const Dropdowns = () => import('@/views/buttons/Dropdowns.vue')
const BrandButtons = () => import('@/views/buttons/BrandButtons.vue')
const LoadingButtons = () => import('@/views/buttons/LoadingButtons.vue')

// Views - Editors
const TextEditors = () => import('@/views/editors/TextEditors.vue')
const CodeEditors = () => import('@/views/editors/CodeEditors.vue')

// Views - Forms
const BasicForms = () => import('@/views/forms/Forms.vue')
const AdvancedForms = () => import('@/views/forms/AdvancedForms.vue')
const ValidationForms = () => import('@/views/forms/ValidationForms.vue')
const MultiSelect = () => import('@/views/forms/MultiSelect.vue')

// Views GoogleMaps
const GoogleMaps = () => import('@/views/GoogleMaps.vue')

// Views - Icons
const CoreUIIcons = () => import('@/views/icons/CoreUIIcons.vue')
const Brands = () => import('@/views/icons/Brands.vue')
const Flags = () => import('@/views/icons/Flags.vue')

// Views - Notifications
const Alerts = () => import('@/views/notifications/Alerts.vue')
const Badges = () => import('@/views/notifications/Badges.vue')
const Modals = () => import('@/views/notifications/Modals.vue')
const Toaster = () => import('@/views/notifications/Toaster.vue')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404.vue')
const Page500 = () => import('@/views/pages/Page500.vue')
const Login = () => import('@/views/pages/Login.vue')
const Register = () => import('@/views/pages/Register.vue')

// Users
const Users = () => import('@/views/users/Users.vue')
const User = () => import('@/views/users/User.vue')

// Plugins
const Draggable = () => import('@/views/plugins/Draggable.vue')
const Calendar = () => import('@/views/plugins/Calendar.vue')
const Spinners = () => import('@/views/plugins/Spinners.vue')

// Apps -> Invoice
const Invoice = () => import('@/views/apps/invoicing/Invoice.vue')

// Apps -> Email
const EmailApp = () => import('@/views/apps/email/EmailApp.vue')
const Compose = () => import('@/views/apps/email/Compose.vue')
const Inbox = () => import('@/views/apps/email/Inbox.vue')
const Message = () => import('@/views/apps/email/Message.vue')

Vue.use(Router)

export default new Router({
    mode: 'hash', // https://router.vuejs.org/api/#mode
    linkActiveClass: 'open active',
    // scrollBehavior: () => ({ y: 0 }),
    routes: [
        {
            path: '/',
            redirect: '/dashboard',
            name: 'Home',
            component: TheContainer,
            children: [
                {
                    path: 'dashboard',
                    name: 'Dashboard',
                    component: Dashboard,
                },
                {
                    // path: 'explore-pools',
                    // name: 'ExplorePools',
                    // // component: ExplorePools,
                    // component: {
                    //     render(c) {
                    //         return c('router-view')
                    //     },
                    // },
                    path: 'explore-pools',
                    meta: { label: 'ExplorePools' },
                    component: {
                        render(c) {
                            return c('router-view')
                        },
                    },
                    children: [
                        {
                            path: '',
                            name: 'ExplorePools',
                            component: ExplorePools,
                        },
                        {
                            path: ':id',
                            meta: {
                                label: 'Pool',
                            },
                            name: 'Pool',
                            component: Pool,
                        },
                    ],
                },
                {
                    path: 'create-pool',
                    name: 'CreatePool',
                    component: CreatePool,
                },
                {
                    path: 'exchange',
                    name: 'Exchange',
                    component: Exchange,
                },
                {
                    path: 'wallet',
                    name: 'Wallet',
                    component: Wallet,
                },
                // {
                //     path: 'pool',
                //     name: 'Pool',
                //     component: Pool,
                // },
                {
                    path: 'theme',
                    redirect: '/theme/colors',
                    name: 'Theme',
                    component: {
                        render(c) {
                            return c('router-view')
                        },
                    },
                    children: [
                        {
                            path: 'colors',
                            name: 'Colors',
                            component: Colors,
                        },
                        {
                            path: 'typography',
                            name: 'Typography',
                            component: Typography,
                        },
                    ],
                },
                {
                    path: 'charts',
                    name: 'Charts',
                    component: Charts,
                },
                {
                    path: 'tables',
                    redirect: '/tables/tables',
                    name: 'Tables',
                    component: {
                        render(c) {
                            return c('router-view')
                        },
                    },
                    children: [
                        {
                            path: 'tables',
                            name: 'Basic tables',
                            component: Tables,
                        },
                        {
                            path: 'advanced-tables',
                            name: 'Advanced tables',
                            component: AdvancedTables,
                        },
                    ],
                },
                {
                    path: 'widgets',
                    name: 'Widgets',
                    component: Widgets,
                },
                {
                    path: 'users',
                    meta: { label: 'Users' },
                    component: {
                        render(c) {
                            return c('router-view')
                        },
                    },
                    children: [
                        {
                            path: '',
                            name: 'Users',
                            component: Users,
                        },
                        {
                            path: ':id',
                            meta: {
                                label: 'User Details',
                            },
                            name: 'User',
                            component: User,
                        },
                    ],
                },
                {
                    path: 'base',
                    redirect: '/base/cards',
                    name: 'Base',
                    component: {
                        render(c) {
                            return c('router-view')
                        },
                    },
                    children: [
                        {
                            path: 'breadcrumbs',
                            name: 'Breadcrumbs',
                            component: Breadcrumbs,
                        },
                        {
                            path: 'cards',
                            name: 'Cards',
                            component: Cards,
                        },
                        {
                            path: 'carousels',
                            name: 'Carousels',
                            component: Carousels,
                        },
                        {
                            path: 'collapses',
                            name: 'Collapses',
                            component: Collapses,
                        },
                        {
                            path: 'jumbotrons',
                            name: 'Jumbotrons',
                            component: Jumbotrons,
                        },
                        {
                            path: 'list-groups',
                            name: 'List Groups',
                            component: ListGroups,
                        },
                        {
                            path: 'navs',
                            name: 'Navs',
                            component: Navs,
                        },
                        {
                            path: 'navbars',
                            name: 'Navbars',
                            component: Navbars,
                        },
                        {
                            path: 'paginations',
                            name: 'Paginations',
                            component: Paginations,
                        },
                        {
                            path: 'popovers',
                            name: 'Popovers',
                            component: Popovers,
                        },
                        {
                            path: 'progress-bars',
                            name: 'Progress Bars',
                            component: ProgressBars,
                        },
                        {
                            path: 'switches',
                            name: 'Switches',
                            component: Switches,
                        },
                        {
                            path: 'tabs',
                            name: 'Tabs',
                            component: Tabs,
                        },
                        {
                            path: 'tooltips',
                            name: 'Tooltips',
                            component: Tooltips,
                        },
                    ],
                },
                {
                    path: 'buttons',
                    redirect: '/buttons/standard-buttons',
                    name: 'Buttons',
                    component: {
                        render(c) {
                            return c('router-view')
                        },
                    },
                    children: [
                        {
                            path: 'standard-buttons',
                            name: 'Standard Buttons',
                            component: StandardButtons,
                        },
                        {
                            path: 'button-groups',
                            name: 'Button Groups',
                            component: ButtonGroups,
                        },
                        {
                            path: 'dropdowns',
                            name: 'Dropdowns',
                            component: Dropdowns,
                        },
                        {
                            path: 'brand-buttons',
                            name: 'Brand Buttons',
                            component: BrandButtons,
                        },
                        {
                            path: 'loading-buttons',
                            name: 'Loading Buttons',
                            component: LoadingButtons,
                        },
                    ],
                },
                {
                    path: 'editors',
                    redirect: '/editors/text-editors',
                    name: 'Editors',
                    component: {
                        render(c) {
                            return c('router-view')
                        },
                    },
                    children: [
                        {
                            path: 'text-editors',
                            name: 'Text Editors',
                            component: TextEditors,
                        },
                        {
                            path: 'code-editors',
                            name: 'Code Editors',
                            component: CodeEditors,
                        },
                    ],
                },
                {
                    path: 'forms',
                    redirect: '/forms/basic-forms',
                    name: 'Forms',
                    component: {
                        render(c) {
                            return c('router-view')
                        },
                    },
                    children: [
                        {
                            path: 'basic-forms',
                            name: 'Basic Forms',
                            component: BasicForms,
                        },
                        {
                            path: 'advanced-forms',
                            name: 'Advanced Forms',
                            component: AdvancedForms,
                        },
                        {
                            path: 'validation-forms',
                            name: 'Form Validation',
                            component: ValidationForms,
                        },
                        {
                            path: 'multi-select',
                            name: 'Multiselect',
                            component: MultiSelect,
                        },
                    ],
                },
                {
                    path: 'google-maps',
                    name: 'Google Maps',
                    component: GoogleMaps,
                },
                {
                    path: 'icons',
                    redirect: '/icons/font-awesome',
                    name: 'Icons',
                    component: {
                        render(c) {
                            return c('router-view')
                        },
                    },
                    children: [
                        {
                            path: 'coreui-icons',
                            name: 'CoreUI Icons',
                            component: CoreUIIcons,
                        },
                        {
                            path: 'flags',
                            name: 'Flags',
                            component: Flags,
                        },
                        {
                            path: 'brands',
                            name: 'Brands',
                            component: Brands,
                        },
                    ],
                },
                {
                    path: 'notifications',
                    redirect: '/notifications/alerts',
                    name: 'Notifications',
                    component: {
                        render(c) {
                            return c('router-view')
                        },
                    },
                    children: [
                        {
                            path: 'alerts',
                            name: 'Alerts',
                            component: Alerts,
                        },
                        {
                            path: 'badges',
                            name: 'Badges',
                            component: Badges,
                        },
                        {
                            path: 'modals',
                            name: 'Modals',
                            component: Modals,
                        },
                        {
                            path: 'toaster',
                            name: 'Toaster',
                            component: Toaster,
                        },
                    ],
                },
                {
                    path: 'plugins',
                    redirect: '/plugins/draggable',
                    name: 'Plugins',
                    component: {
                        render(c) {
                            return c('router-view')
                        },
                    },
                    children: [
                        {
                            path: 'draggable',
                            name: 'Draggable Cards',
                            component: Draggable,
                        },
                        {
                            path: 'calendar',
                            name: 'Calendar',
                            component: Calendar,
                        },
                        {
                            path: 'spinners',
                            name: 'Spinners',
                            component: Spinners,
                        },
                    ],
                },

                {
                    path: 'apps',
                    name: 'Apps',
                    redirect: '/apps/invoicing/invoice',
                    component: {
                        render(c) {
                            return c('router-view')
                        },
                    },
                    children: [
                        {
                            path: 'invoicing',
                            redirect: '/apps/invoicing/invoice',
                            name: 'Invoicing',
                            component: {
                                render(c) {
                                    return c('router-view')
                                },
                            },
                            children: [
                                {
                                    path: 'invoice',
                                    name: 'Invoice',
                                    component: Invoice,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            path: '/apps/email',
            redirect: '/apps/email/inbox',
            name: 'Email',
            component: EmailApp,
            children: [
                {
                    path: 'compose',
                    name: 'Compose',
                    component: Compose,
                },
                {
                    path: 'inbox',
                    name: 'Inbox',
                    component: Inbox,
                },
                {
                    path: 'message',
                    name: 'Message',
                    component: Message,
                },
            ],
        },
        {
            path: '/pages',
            redirect: '/pages/404',
            name: 'Pages',
            component: {
                render(c) {
                    return c('router-view')
                },
            },
            children: [
                {
                    path: '404',
                    name: 'Page404',
                    component: Page404,
                },
                {
                    path: '500',
                    name: 'Page500',
                    component: Page500,
                },
                {
                    path: 'login',
                    name: 'Login',
                    component: Login,
                },
                {
                    path: 'register',
                    name: 'Register',
                    component: Register,
                },
            ],
        },
    ],
})
