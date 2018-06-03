import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { ConversationsPage } from '../conversations/conversations';
import {MessagesPage} from '../messages/messages';
import { HomePage } from '../home/home';
import { AuthPage } from '../auth/auth';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage { 

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = ConversationsPage; 
  tab5Root = MessagesPage;   
  tab6Root = AuthPage;

  constructor() {

  }
}
