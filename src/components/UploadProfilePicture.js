import React, {useEffect} from 'react'
import {UPLOAD_FILE} from '../queries'
import { gql, useQuery, useApolloClient, useMutation} from '@apollo/client'
import { Button } from 'react-bootstrap';

const UploadProfilePicture = () => {
  const [signleUpload, uploadFileResult] = useMutation(UPLOAD_FILE, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (uploadFileResult.data) {
      console.log("RESULT", uploadFileResult.data)
    }
  }, [uploadFileResult.data])

  return (
    <div>
      <input
      type="file"
      required
      onChange={({ target: { validity, files: [file] } }) =>
        validity.valid && signleUpload({ variables: { file } }) && console.log("FILE", file)
      }
      />
    </div>
  );
};

export default UploadProfilePicture
