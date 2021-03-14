import styled from "styled-components";
import { FormEvent } from "react";
import { useForm } from "react-hook-form";
import { Redirect, withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ErrorMessage } from '@hookform/error-message';
import { useWeb3React } from "@web3-react/core";

import { ROUTES } from "../constants/routes";
import SelectTokens from "../components/SelectTokens";
import { setFormData } from "../state/launch/actions";
import { useLaunchState } from "../state/launch/hooks";
import {
  Header,
  ControlRow,
  FormFooterWrapper,
  FormRow,
  FormWrapper,
  Input,
  Label,
  PrimaryButton,
  Title
} from "../theme";


const IndexForm = styled.form`
  margin-bottom: 30rem;
`
const LabelRight = styled(Label)`
  text-align: right;
`
const MessageHelpers = styled.div`
  height: .5rem;
  margin-bottom: .5rem;
  font-size: .7rem;
  padding-top: .1rem;
  padding-left: .8rem;
  color: red;
`
type Props = {
    history: any
}

function DefineIndexFundPage({ history }: Props): JSX.Element {
  const { active } = useWeb3React()
  const launchState = useLaunchState()
  const { register, handleSubmit, formState, control, errors } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: launchState,
    criteriaMode: "firstError",
    shouldFocusError: false,
    shouldUnregister: true,
  })

  const dispatch = useDispatch()

  const onSubmit = (data: any) => {
    dispatch(setFormData(data))
    history.push(ROUTES.LAUNCH)
    window.scrollTo(0, 0);
  };

  const toUpperCase = (event: FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    target.value = target.value.toUpperCase()
  }


  return (
    <FormWrapper>
      {!active && <Redirect to={ROUTES.HOME} />}
      <Header>
        <Title>Create Index Fund</Title>
      </Header>
      <IndexForm onSubmit={handleSubmit(onSubmit)}>
        <ControlRow>
          <Label>Name Your Fund</Label>
          <Input name="name" autoComplete="off" type="text" placeholder="DEX Top 10" ref={register({
            required: {value: true, message: 'Name is required'}, maxLength: 80
          })} />
          <MessageHelpers>
            <ErrorMessage errors={errors} name="name" />
          </MessageHelpers>
        </ControlRow>
        <ControlRow>
          <Label>Ticker Symbol</Label>
          <Input name="symbol" type="text" placeholder="DTT" onKeyUp={toUpperCase} ref={register({
            required: { value: true, message: 'Symbol is required' },
            minLength: { value: 3, message: 'Min length of three characters' }
          })} />
          <MessageHelpers>
            <ErrorMessage errors={errors} name="symbol" />
          </MessageHelpers>
        </ControlRow>
        <ControlRow>
          <Label>Default Price in Dollars</Label>
          <Input name="price" type="number" placeholder="100" ref={register({
            required: {value: true, message: 'Price is required'},
            maxLength: 80
          })} />
          <MessageHelpers>
            <ErrorMessage errors={errors} name="price" />
          </MessageHelpers>
        </ControlRow>

        <FormRow>
          <Label>Select Tokens</Label>
          <LabelRight>Default Allocation</LabelRight>
        </FormRow>
        <SelectTokens control={control}></SelectTokens>
        <FormFooterWrapper>
          <div></div>
          <PrimaryButton type="submit" disabled={!formState.isValid || launchState.tokens[0]?.value?.address === undefined}>Continue</PrimaryButton>
        </FormFooterWrapper>
      </IndexForm>
    </FormWrapper>
  );
}

export default withRouter(DefineIndexFundPage)
