import Head from 'next/head'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import configJson from '../config/2022/config.json'
import { Config, InputProps, Button, QrModal } from 'ui'
import Section from '../components/Section'
import LZMA from 'lzma-web'

async function compress(
  data: string | Record<string, unknown>
): Promise<string> {
  const lzma = new LZMA()
  if (typeof data === 'object') data = JSON.stringify(data)

  const compressed = await lzma.compress(data, 9)

  console.log(compressed)
  return compressed.toString()
}

function buildConfig(c: Config) {
  let config: Config = { ...c }
  config.sections
    .map((s) => s.fields)
    .flat()
    .forEach((f) => (f.value = f.defaultValue))
  return config
}

function getDefaultConfig(): Config {
  return buildConfig(configJson as Config)
}

export default function Home() {
  const [formData, setFormData] = useState<Config>(getDefaultConfig)
  const [qrData, setQrData] = useState('')
  useEffect(() => {
    ;(async () => {
      let minified = Object.fromEntries(
        formData.sections
          .map((section) =>
            section.fields.map(({ value, code }) => [code, value] as const)
          )
          .flat()
      )
      let compressed = await compress(JSON.stringify(minified))

      setQrData(compressed)
      console.log(compressed)
    })()
  }, [formData])

  useEffect(() => {
    let userConfig = localStorage.getItem('QRScoutUserConfig')
    if (userConfig) {
      setFormData(buildConfig(JSON.parse(userConfig) as Config))
    } else {
      setFormData(getDefaultConfig())
    }
  }, [])


  function updateValue(sectionName: string, code: string, data: any) {
    const currentData = { ...formData }
    let section = currentData.sections.find((s) => s.name === sectionName)
    if (section) {
      let field = section.fields.find((f) => f.code === code)
      if (field) {
        field.value = data
      }
    }
    setFormData(currentData)
  }

  function getFieldValue(code: string): any {
    return formData.sections
      .map((s) => s.fields)
      .flat()
      .find((f) => f.code === code)?.value
  }

  function resetSections() {
    const currentData = { ...formData }

    currentData.sections
      .filter((s) => !s.preserveDataOnReset)
      .map((s) => s.fields)
      .flat()
      .forEach((f) => {
        console.log(`resetting ${f.title} from ${f.value} to ${f.defaultValue}`)
        f.value = f.defaultValue
      })

    setFormData(currentData)
  }

  return (
    <div className="min-h-screen py-2">
      <Head>
        <title>{formData.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="font-sans text-6xl font-bold">
          <div className="text-red-600">{formData.page_title}</div>
        </h1>
        <form>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {formData.sections.map((section) => {
              return (
                <Section
                  key={section.name}
                  name={section.name}
                  inputs={section.fields}
                  onValueChanged={updateValue}
                />
              )
            })}
          </div>
        </form>
        <div className="flex flex-row justify-evenly">
          <QrModal
            title={`${getFieldValue('robot')} - ${getFieldValue(
              'matchNumber'
            )}`}
            buttonText="Open QrCode"
          >
            {qrData}
          </QrModal>
          <Button variant="danger" onClick={() => resetSections()}>
            Reset
          </Button>
        </div>
      </main>
    </div>
  )
}
