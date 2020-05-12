import gql from 'graphql-tag';
import { FRAGMENT_MESSAGE } from '../fragments/message.fragment';

export default gql`
  subscription MessageAdded {
    messageAdded {
      ...Message
    }
  }
  ${FRAGMENT_MESSAGE}
`;
