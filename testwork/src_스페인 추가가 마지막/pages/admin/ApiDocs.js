import React from "react"
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

const ApiDocs = () => {
  return (
    <>
      <SwaggerUI url="http://localhost:8888/v3/api-docs" />
    </>
  )
}

export default ApiDocs
