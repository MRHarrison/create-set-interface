import { FormEvent } from 'react';
import { FormRow, IconButton } from '../../theme';
import styled from "styled-components"

import { setAllocation } from "../../state/launch/actions"
import { TokenSelect } from './TokenSelect'
import { Controller, useFieldArray } from 'react-hook-form';
import { Plus } from 'react-feather';
import { useDispatch } from 'react-redux';
import { useLaunchState } from '../../state/launch/hooks';


const AddFormRow = styled(FormRow)`
  justify-content: flex-start;
  margin-top: 1rem;
  align-items: center;
`
const TextWrapper = styled.div`
  width: 100%;
  margin-left: 1rem;
`

type Props = {
  control: any
}

export default function SelectTokens({ control }: Props) {
  const dispatch = useDispatch()
  const launchState = useLaunchState()
  const { fields, append, remove } = useFieldArray({
      control,
      name: 'tokens'
    });

  const addToken = (event: FormEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    append(event)
    dispatch(setAllocation((100 / (fields.length + 1))))
  }

  return (
    <>
      {fields.map((item, index) => (
        <Controller
          control={control}
          name={`tokens[${index}].value`}
          key={item.id}
          defaultValue={item.value || {name: 'Select Asset'}}
          render={(
            { onChange },
          ) => (
            <TokenSelect
              remove={remove}
              add={append}
              idx={index}
              fields={fields}
              onChange={onChange}
            />
          )}
        />
      ))}
      <AddFormRow>
        <IconButton onClick={addToken} disabled={launchState.tokens[fields.length - 1]?.value?.address === undefined || fields.length >= 5}><Plus size={18} color="#444"/></IconButton>
        <TextWrapper>
          Add More
        </TextWrapper>
      </AddFormRow>
    </>
  )
}
