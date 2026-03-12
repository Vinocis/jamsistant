defmodule Jamsitant.Repo do
  use Ecto.Repo,
    otp_app: :jamsitant,
    adapter: Ecto.Adapters.Postgres
end
