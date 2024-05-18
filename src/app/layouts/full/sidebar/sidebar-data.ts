import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/dashboard',
  },
  {
    navCap: 'Administración',
  },
  {
    displayName: 'Colegio',
    iconName: 'rosette',
    route: '/administracion/colegio/list',
  },
  {
    displayName: 'Persona',
    iconName: 'rosette',
    route: '/administracion/persona/list',
  },

  {
    displayName: 'Certificado',
    iconName: 'rosette',
    route: '/administracion/certificado/list',
  },
  {
    displayName: 'Matrícula',
    iconName: 'rosette',
    route: '/administracion/matricula/list',
  },
  
];
