void main()
{
	//INIT WEATHER BEFORE ECONOMY INIT------------------------
	Weather weather = g_Game.GetWeather();

	weather.MissionWeather(false);    // false = use weather controller from Weather.c

	weather.GetOvercast().Set( Math.RandomFloatInclusive(0.4, 0.6), 1, 0);
	weather.GetRain().Set( 0, 0, 1);
	weather.GetFog().Set( Math.RandomFloatInclusive(0.05, 0.1), 1, 0);

	//INIT ECONOMY--------------------------------------
	Hive ce = CreateHive();
	if ( ce )
		ce.InitOffline();

	//DATE RESET AFTER ECONOMY INIT-------------------------
	int year, month, day, hour, minute;
	int reset_month = 9, reset_day = 20;
	GetGame().GetWorld().GetDate(year, month, day, hour, minute);

    if ((month == reset_month) && (day < reset_day))
    {
        GetGame().GetWorld().SetDate(year, reset_month, reset_day, hour, minute);
    }
    else
    {
        if ((month == reset_month + 1) && (day > reset_day))
        {
            GetGame().GetWorld().SetDate(year, reset_month, reset_day, hour, minute);
        }
        else
        {
            if ((month < reset_month) || (month > reset_month + 1))
            {
                GetGame().GetWorld().SetDate(year, reset_month, reset_day, hour, minute);
            }
        }
    }
}

class CustomMission: MissionServer
{
	void SetRandomHealth(EntityAI itemEnt)
	{
		if ( itemEnt )
		{
			int rndHlt = Math.RandomInt(55,100);
			itemEnt.SetHealth("","",rndHlt);
		}
	}
	override void StartingEquipSetup(PlayerBase player, bool clothesChosen)
	{
		EntityAI itemClothing;
		EntityAI itemEnt;
		ItemBase itemBs;
		float rand;

		ref TStringArray guantes = {"WorkingGloves_Black", "WorkingGloves_Beige", "WorkingGloves_Brown"};
        ref TStringArray chaquetas = {"Winter_Parka_Base","Winter_Parka_White","Winter_Parka_Green"};
        ref TStringArray pantalones = {"Jeans_Black","Jeans_BlueDark","Jeans_Brown"};
        ref TStringArray botas = {"HikingBoots_Brown","HikingBoots_Black"};
		ref TStringArray accesorios = {"Chemlight_White","Chemlight_Red","Chemlight_Green","Chemlight_Blue","Chemlight_Yellow"};
        ref TStringArray bebidas = {"SodaCan_Pipsi", "SodaCan_Cola", "SodaCan_Spite", "SodaCan_Kvass"};
        ref TStringArray comidas = {"Apple","Pear", "Plum"};
		player.RemoveAllItems();
	    player.GetInventory().CreateInInventory(guantes.GetRandomElement());
	    player.GetInventory().CreateInInventory(chaquetas.GetRandomElement());
		player.GetInventory().CreateInInventory(pantalones.GetRandomElement());
		player.GetInventory().CreateInInventory(botas.GetRandomElement());
		player.GetInventory().CreateInInventory(accesorios.GetRandomElement());
		player.GetInventory().CreateInInventory(bebidas.GetRandomElement());
        player.GetInventory().CreateInInventory(comidas.GetRandomElement());
		ItemBase rags = player.GetInventory().CreateInInventory("Rag");
		rags.SetQuantity(4);
        ItemBase airborneMask = player.GetInventory().CreateInInventory("AirborneMask");
		airborneMask.SetQuantity(1);
        ItemBase hellCraftedKnife = player.GetInventory().CreateInInventory("Hell_Crafted_Knife");
		hellCraftedKnife.SetQuantity(1);
        ItemBase personalRadio = player.GetInventory().CreateInInventory("PersonalRadio");
        personalRadio.GetInventory().CreateAttachment("Battery9V");
	}
};

Mission CreateCustomMission(string path)
{
	return new CustomMission();
}