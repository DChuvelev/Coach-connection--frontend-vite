export interface Props {
  isBusy: boolean;
  errorMessage: string | undefined;
  handleSubmit: (evt: React.FormEvent) => void;
  btnTxtTypeBusy: string;
  btnTxt: string;
}
