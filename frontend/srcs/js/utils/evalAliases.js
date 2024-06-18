export async function evalAliases(aliases) {
    const token = localStorage.getItem('accessToken');
    const data = {
      aliases: aliases
    };
    const response = await fetch('aliases/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(data)
    });

    if (!response.ok){
      const errorData = await response.json();
      console.error('Error Evaluating Aliases:', errorData);
      return;
    }

    return response.json();
}
