import SearchApp from './components/SearchApp.vue';
import App from './App.vue';
import AddEntryPage from './components/metadata/AddEntryPage.vue';

export const routes = [
  { 
    path: '',
    component: SearchApp,
      
  },
  { 
    path: '/addentry', 
    name: 'AddEntryPage',
    component: AddEntryPage,
    props: true
  }
];