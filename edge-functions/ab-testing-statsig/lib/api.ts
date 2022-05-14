const STATSIG_URL = 'https://api.statsig.com/v1'
const STATSIG_CLIENT_KEY = process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!

type Experiment = {
  name: string
  value: {
    name: string
  }
  group: string
  rule_id?: string
}

/**
 * Fetch wrapper for the Statsig API. The `apiKey` can be one either the `Client-SDK Key` or
 * the `Server-side secret Key`.
 */
async function statsig(
  path: string,
  { apiKey, data, ...init }: { apiKey: string; data?: any } & RequestInit
) {
  const url = new URL(STATSIG_URL)
  url.pathname = path

  if (!apiKey) {
    throw new Error(
      'No Statsig API key was provided, use either the client-SDK key or the server-side secret key'
    )
  }

  const res = await fetch(url, {
    ...init,
    // All Statsig APIs use POST
    method: 'POST',
    headers: {
      'statsig-api-key': apiKey,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    body: JSON.stringify(data),
  })

  const resData = res.headers.get('Content-Type')!.includes('application/json')
    ? await res.json()
    : await res.text()

  if (res.ok) {
    return resData
  } else {
    throw new Error(
      `Statsig failed with (${res.status}): ${
        typeof resData === 'string' ? resData : JSON.stringify(resData, null, 2)
      }`
    )
  }
}

const api = {
  getGroups: async () => ['a', 'b'],
  async getExperiment(
    userID: string,
    experiment: string,
    defaultGroup: string = 'a'
  ) {
    const { value }: Experiment = await statsig('/get_config', {
      apiKey: STATSIG_CLIENT_KEY,
      data: {
        user: { userID },
        configName: experiment,
      },
    })
    return value.name || defaultGroup
  },
  logExposure(userID: string, group: string, experiment: string) {
    return statsig('/log_custom_exposure', {
      apiKey: STATSIG_CLIENT_KEY,
      data: {
        exposures: [
          {
            user: { userID },
            experimentName: experiment,
            group,
          },
        ],
      },
    })
  },
}

export default api
