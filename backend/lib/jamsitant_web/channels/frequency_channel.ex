defmodule JamsitantWeb.FrequencyChannel do
  use JamsitantWeb, :channel

  @impl true
  def join("frequency:to_note", _payload, socket) do
    dbg("JOINED THE CHANNEL LETS GOOO")
    {:ok, socket}
  end

  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (frequency:lobby).
  @impl true
  def handle_in("frequency_to_note", %{"clarity" => _clarity, "pitch" => pitch} = payload, socket) do
    dbg(payload)
    note = frequency_to_note(pitch) |> dbg()

    {:reply, {:ok, %{note: note}}, socket}
  end

  # TODO:
  # Create the actual logic
  defp frequency_to_note(_pitch), do: "A4"

  # TODO:
  # Add authorization logic here as required.
  # defp authorized?(_payload) do
  #   true
  # end
end
