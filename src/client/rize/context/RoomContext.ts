import {ViewContext} from '../../script/lib/ViewContext';

export class RoomContext implements ViewContext {
    onActivate(mountpoint: Element): void {}
    onDestroy(mountpoint: Element): void {}
    onResume(mountpoint: Element): void {}
    onSuspend(mountpoint: Element): void {}
}