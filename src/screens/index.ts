import type { ComponentType } from 'react';
import type { ScreenId } from '../nav';

import { Welcome } from './Welcome';
import { Language } from './Language';
import { SignIn } from './SignIn';
import { Personal } from './Personal';
import { Connect } from './Connect';
import { Voice } from './Voice';
import { AddBusiness } from './AddBusiness';
import { BusinessDetails } from './BusinessDetails';
import { BusinessDashboard } from './BusinessDashboard';
import { Knowledge } from './Knowledge';
import { ChatList } from './ChatList';
import { Feed } from './Feed';
import { Snap } from './Snap';
import { GroupChat } from './GroupChat';
import { Chat } from './Chat';
import { ChatAttach } from './ChatAttach';
import { ChatReact } from './ChatReact';
import { Reels } from './Reels';
import { Order } from './Order';
import { BusinessPage } from './BusinessPage';
import { Profile } from './Profile';
import { Recharge } from './Recharge';

export interface ScreenMeta {
  Comp: ComponentType;
  label: string;
  section: string;
  dark?: boolean;
}

// Registry of every screen, with the canvas label/section from the design.
export const SCREENS: Record<ScreenId, ScreenMeta> = {
  welcome: { Comp: Welcome, label: '01 · Welcome', section: 'Welcome' },
  language: { Comp: Language, label: '02 · Language', section: 'Welcome' },
  signin: { Comp: SignIn, label: '03 · Sign in', section: 'Welcome' },
  personal: { Comp: Personal, label: '04 · Personal info', section: 'About you' },
  connect: { Comp: Connect, label: '05 · Connect tools', section: 'About you' },
  voice: { Comp: Voice, label: '06 · Voice setup', section: 'About you' },
  addBusiness: { Comp: AddBusiness, label: '07 · Add business', section: 'Your businesses' },
  businessDetails: { Comp: BusinessDetails, label: '08 · Business details', section: 'Your businesses' },
  businessDashboard: { Comp: BusinessDashboard, label: '09 · Business dashboard', section: 'Your businesses' },
  knowledge: { Comp: Knowledge, label: '10 · Knowledge base', section: 'Your businesses' },
  chats: { Comp: ChatList, label: '11 · Chats', section: 'The app' },
  feed: { Comp: Feed, label: '12 · Feed', section: 'The app' },
  snap: { Comp: Snap, label: '13 · Snap camera', section: 'The app', dark: true },
  groupChat: { Comp: GroupChat, label: '14 · Group chat', section: 'The app' },
  chat: { Comp: Chat, label: '15 · Chat with aihoni', section: 'The app' },
  chatAttach: { Comp: ChatAttach, label: '16 · Chat · attachments', section: 'The app' },
  chatReact: { Comp: ChatReact, label: '17 · Chat · react & reply', section: 'The app' },
  reels: { Comp: Reels, label: '18 · Reels', section: 'The app', dark: true },
  order: { Comp: Order, label: '19 · Order from reel', section: 'The app', dark: true },
  businessPage: { Comp: BusinessPage, label: '20 · Business page', section: 'The app' },
  profile: { Comp: Profile, label: '21 · Profile', section: 'The app' },
  recharge: { Comp: Recharge, label: '22 · Recharge points', section: 'The app' },
};
