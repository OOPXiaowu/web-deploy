import copyText from './module/vCopy';

export default function directive(app){
    app.directive('copy', copyText)
}
